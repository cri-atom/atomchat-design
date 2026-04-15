import {
  Component, AfterViewInit, OnDestroy, ViewChild, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef, NgZone, HostListener,
  inject, DestroyRef, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, combineLatest } from 'rxjs';
import { dia, shapes } from '@joint/plus';
import { FlowAgentInternalStateService } from '../../../application/state/flow-agent-internal-state.service';
import { FlowAgentDefaultsService } from '../../../application/state/flow-agent-defaults.service';
import { FlowAgentValidationService } from '../../../application/state/flow-agent-validation.service';
import { AgentNodeType, FlowAgentNode, FlowAgentEdge, ValidationError } from '../../../core/model/agent-flow.model';
import {
  BODY_BG,
  BODY_BORDER,
  EDGE_SELECTED,
  ERROR_COLOR,
  SELECTED_BORDER,
  ZOOM_INITIAL,
  ZOOM_MAX,
  ZOOM_MIN,
} from '../theme';
import { environment } from '../../../environments/environment';

import '../shapes/app.shapes';

@Component({
  selector: 'flowagent-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paperContainer') paperContainer!: ElementRef<HTMLDivElement>;

  graph!: dia.Graph;
  paper!: dia.Paper;
  menuParentId: string | null = null;
  menuPos = { x: 0, y: 0 };
  public readonly zoomPercent = signal(100);
  public showFabMenu = false;
  public isChatOpen = false;
  public showErrorPanel = false;
  public validationErrors: ValidationError[] = [];
  public nodeActionsPos: { x: number; y: number } | null = null;
  public nodeActionsNodeId: string | null = null;
  public nodeActionsVisible = false;
  public hoverNodeActionsPos: { x: number; y: number } | null = null;
  public hoverNodeActionsNodeId: string | null = null;
  public hoverNodeActionsVisible = false;
  public edgeActionsPos: { x: number; y: number } | null = null;
  public edgeActionsEdgeId: string | null = null;
  public edgeActionsVisible = false;
  public currentScale = 1;
  public readonly testingMode = (environment.testingMode ?? false) || localStorage.getItem('debug-mode') !== null;
  public readonly showDebugDialog = signal(false);
  public readonly debugJson = signal('');

  private readonly state = inject(FlowAgentInternalStateService);
  private readonly defaults = inject(FlowAgentDefaultsService);
  private readonly validation = inject(FlowAgentValidationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  private _syncing = false;
  private _menuJustOpened = false;
  private _preventNextClose = false;
  private _draggingNodeId: string | null = null;
  private _panCleanup: (() => void) | null = null;
  private _pendingMenuParentId: string | null = null;
  private _pendingMenuPos: { x: number; y: number } = { x: 0, y: 0 };
  private _resizeObserver: ResizeObserver | null = null;
  private readonly _agentAddHideDelayMs = 450;
  private readonly _nodeActionsFadeMs = 180;
  private readonly _focusAnimationDurationMs = 320;
  private readonly _agentAddHideTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private _nodeActionsFadeOutTimeout: ReturnType<typeof setTimeout> | null = null;
  private _hoverNodeActionsFadeOutTimeout: ReturnType<typeof setTimeout> | null = null;
  private _edgeActionsFadeOutTimeout: ReturnType<typeof setTimeout> | null = null;
  private _edgeActionsHoverHideTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly _edgeActionsHoverHideDelayMs = 800;
  private _focusAnimationFrameId: number | null = null;

  ngAfterViewInit(): void {
    this.initGraph();
    this.initPaper();
    this.bindPaperEvents();
    this.syncStateToGraph();
    this.syncSelectionVisual();
    this.syncEdgeSelectionVisual();
    this.syncValidation();

    this._syncing = true;
    this.diffNodes(this.state.nodes$.value);
    this.diffEdges(this.state.edges$.value);
    this._syncing = false;
    this.updateStartButtonVisibility();

    requestAnimationFrame(() => {
      this.paper.setDimensions(
        this.paperContainer.nativeElement.clientWidth,
        this.paperContainer.nativeElement.clientHeight,
      );
      this.centerOnStart(false);
    });

    const resizeTarget = this.paperContainer.nativeElement.parentElement ?? this.paperContainer.nativeElement;
    this._resizeObserver = new ResizeObserver(() => {
      this.paper.setDimensions(
        resizeTarget.clientWidth,
        resizeTarget.clientHeight,
      );
      this.refreshFloatingButtons();
    });
    this._resizeObserver.observe(resizeTarget);
  }

  ngOnDestroy(): void {
    this.cancelFocusAnimation();
    this._panCleanup?.();
    this._resizeObserver?.disconnect();
    for (const timeoutId of this._agentAddHideTimeouts.values()) {
      clearTimeout(timeoutId);
    }
    this._agentAddHideTimeouts.clear();
    if (this._nodeActionsFadeOutTimeout) {
      clearTimeout(this._nodeActionsFadeOutTimeout);
      this._nodeActionsFadeOutTimeout = null;
    }
    if (this._hoverNodeActionsFadeOutTimeout) {
      clearTimeout(this._hoverNodeActionsFadeOutTimeout);
      this._hoverNodeActionsFadeOutTimeout = null;
    }
    if (this._edgeActionsFadeOutTimeout) {
      clearTimeout(this._edgeActionsFadeOutTimeout);
      this._edgeActionsFadeOutTimeout = null;
    }
    if (this._edgeActionsHoverHideTimeout) {
      clearTimeout(this._edgeActionsHoverHideTimeout);
      this._edgeActionsHoverHideTimeout = null;
    }
    this._pendingMenuParentId = null;
    this.paper?.remove();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const target = event.target as HTMLElement;
      const tag = target.tagName.toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      // Solo procesar si el foco está en el canvas o en el body (no en inspector/global-settings)
      if (tag !== 'BODY' && !this.paperContainer.nativeElement.contains(target)) return;

      const selectedNodeId = this.state.selectedNodeId$.value;
      const selectedEdgeId = this.state.selectedEdgeId$.value;

      if (selectedNodeId && selectedNodeId !== 'start-node') {
        this.state.deleteNode(selectedNodeId);
      } else if (selectedEdgeId) {
        this.state.deleteEdge(selectedEdgeId);
      }
    }
  }

  private initGraph(): void {
    this.graph = new dia.Graph({}, { cellNamespace: shapes });
  }

  private initPaper(): void {
    this.paper = new dia.Paper({
      el: this.paperContainer.nativeElement,
      model: this.graph,
      cellViewNamespace: shapes,
      width: '100%',
      height: '100%',
      gridSize: 1,
      drawGrid: false,
      background: { color: 'transparent' },
      interactive: { linkMove: false, labelMove: false },
      defaultLink: () => new (shapes as any).agentApp.Link(),
      defaultConnectionPoint: { name: 'boundary' },
      clickThreshold: 5,
      moveThreshold: 2,
      magnetThreshold: 5,
      highlighting: {
        default: { name: 'stroke', options: { attrs: { stroke: SELECTED_BORDER, 'stroke-width': 1 } } },
        connecting: { name: 'stroke', options: { attrs: { stroke: SELECTED_BORDER, 'stroke-width': 1 } } },
        magnetAvailability: { name: 'stroke', options: { attrs: { stroke: SELECTED_BORDER, 'stroke-width': 1 } } },
        embedding: { name: 'stroke', options: { attrs: { stroke: SELECTED_BORDER, 'stroke-width': 1 } } },
      } as any,
      validateConnection: (sv: dia.CellView, _sm: unknown, tv: dia.CellView) => {
        if (sv === tv) return false;
        return this.isValidDragTarget(sv.model.id as string, tv.model.id as string);
      },
    });
  }

  private bindPaperEvents(): void {
    this.paper.on('element:pointerclick', (cellView: dia.ElementView) => {
      if (this._menuJustOpened) {
        this._menuJustOpened = false;
        if (this._pendingMenuParentId === (cellView.model.id as string)) {
          const parentId = this._pendingMenuParentId;
          const menuPos = { ...this._pendingMenuPos };
          this._pendingMenuParentId = null;
          this._preventNextClose = true;
          this.zone.run(() => {
            this.menuParentId = parentId;
            this.menuPos = menuPos;
            this.cdr.markForCheck();
          });
        }
        return;
      }
      if (!this._syncing) {
        const id = cellView.model.id as string;
        const node = this.state.nodes$.value.find(n => n.id === id);
        if (node?.type !== AgentNodeType.Start) {
          this.zone.run(() => {
            this.state.setSelectedNode(id);
          });
        }
        this.closeMenu();
      }
    });

    this.paper.on('element:mouseenter', (cellView: dia.ElementView) => {
      const nodeId = cellView.model.id as string;
      const node = this.state.nodes$.value.find(n => n.id === nodeId);
      if (node?.type !== AgentNodeType.Agent && node?.type !== AgentNodeType.End) return;
      const selectedNodeId = this.state.selectedNodeId$.value;
      if (selectedNodeId && selectedNodeId !== nodeId) {
        if (node.type === AgentNodeType.Agent) {
          this.clearAgentAddHideTimer(nodeId);
          this.setAgentAddButtonVisibility(nodeId, true);
        }
        this.showHoverNodeActions(nodeId);
        return;
      }
      if (node.type === AgentNodeType.Agent) {
        this.showAgentControls(nodeId);
      } else {
        this.showNodeActions(nodeId);
      }
    });

    this.paper.on('element:mouseleave', (cellView: dia.ElementView) => {
      const nodeId = cellView.model.id as string;
      const node = this.state.nodes$.value.find(n => n.id === nodeId);
      if (node?.type !== AgentNodeType.Agent && node?.type !== AgentNodeType.End) return;
      if (this.state.selectedNodeId$.value === nodeId) return;
      this.scheduleAgentAddHide(nodeId);
    });

    this.paper.on('link:mouseenter', (linkView: dia.LinkView) => {
      const data = linkView.model.get('edgeData') as Record<string, unknown> | undefined;
      if (data?.['conditionType'] == null) return;
      if (this._edgeActionsHoverHideTimeout) {
        clearTimeout(this._edgeActionsHoverHideTimeout);
        this._edgeActionsHoverHideTimeout = null;
      }
      this.zone.run(() => this.computeEdgeActions(linkView.model.id as string));
    });

    this.paper.on('link:mouseleave', (linkView: dia.LinkView) => {
      const edgeId = linkView.model.id as string;
      if (this.edgeActionsEdgeId !== edgeId) return;
      if (this.state.selectedEdgeId$.value === edgeId) return;
      this._edgeActionsHoverHideTimeout = setTimeout(() => {
        this._edgeActionsHoverHideTimeout = null;
        if (this.state.selectedEdgeId$.value === this.edgeActionsEdgeId) return;
        this.zone.run(() => this.hideEdgeActions());
      }, this._edgeActionsHoverHideDelayMs);
    });

    this.paper.on('link:pointerclick', (linkView: dia.LinkView) => {
      const data = linkView.model.get('edgeData') as Record<string, unknown> | undefined;
      if (data?.['conditionType'] !== null && !this._syncing) {
        this.zone.run(() => {
          this.state.setSelectedEdge(linkView.model.id as string);
        });
      }
      this.closeMenu();
    });

    this.paper.on('blank:pointerclick', () => {
      if (!this._syncing) {
        this.zone.run(() => {
          this.state.setSelectedNode(null);
          this.state.setSelectedEdge(null);
          this.showErrorPanel = false;
          this.cdr.markForCheck();
        });
      }
      this.closeMenu();
    });

    this.paper.on('cell:addChild', (cellView: dia.CellView) => {
      const model = cellView.model as dia.Element;
      const parentId = model.id as string;
      const parentNode = this.state.nodes$.value.find(n => n.id === parentId);
      if (!parentNode) return;

      if (parentNode.type === AgentNodeType.Start) {
        this.zone.run(() => {
          const alreadyHasChild = this.state.edges$.value.some(e => e.source === parentId);
          if (!alreadyHasChild) {
            this.state.addChildNode(parentId, AgentNodeType.Agent);
            this.updateStartButtonVisibility();
          }
          this.cdr.markForCheck();
        });
        return;
      }

      this._menuJustOpened = true;
      const pos = model.position();
      const size = model.size();
      const pagePoint = this.paper.localToPagePoint(pos.x + size.width / 2, pos.y + size.height + 20);
      const wrapperRect = this.paperContainer.nativeElement.parentElement!.getBoundingClientRect();

      this._pendingMenuParentId = parentId;
      this._pendingMenuPos = { x: pagePoint.x - wrapperRect.left, y: pagePoint.y - wrapperRect.top };
    });

    this.paper.on('element:pointermove', (cellView: dia.ElementView) => {
      const id = cellView.model.id as string;
      this._draggingNodeId = id;
      if (id === this.nodeActionsNodeId) {
        this.nodeActionsPos = this.getNodeActionsPos(id);
        this.cdr.detectChanges();
      }
      if (id === this.hoverNodeActionsNodeId) {
        this.hoverNodeActionsPos = this.getNodeActionsPos(id);
        this.cdr.detectChanges();
      }
      if (this.edgeActionsEdgeId) {
        const edge = this.state.edges$.value.find(e => e.id === this.edgeActionsEdgeId);
        if (edge && (edge.source === id || edge.target === id)) {
          this.computeEdgeActions(this.edgeActionsEdgeId);
          this.cdr.detectChanges();
        }
      }
      if (id === this.menuParentId) {
        this.zone.run(() => this.closeMenu());
      }
    });

    this.paper.on('element:pointerup', (cellView: dia.ElementView) => {
      if (this._syncing) return;
      const id = cellView.model.id as string;
      const pos = cellView.model.position();
      const nodes = this.state.nodes$.value.map(n =>
        n.id === id ? { ...n, position: { x: pos.x, y: pos.y } } : n
      );
      this._syncing = true;
      this.state.nodes$.next(nodes);
      this._syncing = false;
      this._draggingNodeId = null;
      this.zone.run(() => {
        if (id === this.nodeActionsNodeId) {
          this.computeNodeActions(this.nodeActionsNodeId);
        }
        if (id === this.hoverNodeActionsNodeId) {
          this.computeHoverNodeActions(this.hoverNodeActionsNodeId);
        }
        if (this.edgeActionsEdgeId) {
          const edge = this.state.edges$.value.find(e => e.id === this.edgeActionsEdgeId);
          if (edge && (edge.source === id || edge.target === id)) {
            this.computeEdgeActions(this.edgeActionsEdgeId);
          }
        }
      });
    });

    this.paper.on('blank:mousewheel', (_evt: dia.Event, x: number, y: number, delta: number) => {
      (_evt as any).preventDefault?.();
      this.wheelZoom(delta, x, y);
    });
    this.paper.on('cell:mousewheel', (_cv: dia.CellView, _evt: dia.Event, x: number, y: number, delta: number) => {
      (_evt as any).preventDefault?.();
      this.wheelZoom(delta, x, y);
    });

    this.paper.on('blank:contextmenu', (evt: dia.Event) => {
      (evt as any).preventDefault?.();
      this.zone.run(() => this.centerOnStart());
    });

    this.paper.on('blank:pointerdown', (_evt: dia.Event) => {
      const el = this.paperContainer.nativeElement as HTMLElement;
      el.style.cursor = 'grabbing';
      let lastX = 0, lastY = 0, started = false;

      const onMove = (e: PointerEvent) => {
        if (!started) { lastX = e.clientX; lastY = e.clientY; started = true; return; }
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const t = this.paper.translate();
        this.paper.translate(t.tx + dx, t.ty + dy);
        lastX = e.clientX; lastY = e.clientY;
        if (this.nodeActionsPos) this.nodeActionsPos = { x: this.nodeActionsPos.x + dx, y: this.nodeActionsPos.y + dy };
        if (this.hoverNodeActionsPos) this.hoverNodeActionsPos = { x: this.hoverNodeActionsPos.x + dx, y: this.hoverNodeActionsPos.y + dy };
        if (this.edgeActionsPos) this.edgeActionsPos = { x: this.edgeActionsPos.x + dx, y: this.edgeActionsPos.y + dy };
        this.cdr.detectChanges();
      };
      const onUp = () => {
        el.style.cursor = '';
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        this.zone.run(() => {
          if (this.nodeActionsNodeId) this.computeNodeActions(this.nodeActionsNodeId);
          if (this.hoverNodeActionsNodeId) this.computeHoverNodeActions(this.hoverNodeActionsNodeId);
          if (this.edgeActionsEdgeId) this.computeEdgeActions(this.edgeActionsEdgeId);
        });
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      this._panCleanup = onUp;
    });

    this.paperContainer.nativeElement.addEventListener('wheel', (e: WheelEvent) => e.preventDefault(), { passive: false });

    this.paper.on('link:connect', (linkView: dia.LinkView) => {
      this._menuJustOpened = false;
      this._pendingMenuParentId = null;
      if (this._syncing) return;
      const link = linkView.model;
      const sourceId = link.get('source')?.id as string | undefined;
      const targetId = link.get('target')?.id as string | undefined;

      if (this.state.edges$.value.some(e => e.id === (link.id as string))) return;

      this._syncing = true;
      link.remove();
      this._syncing = false;

      if (!sourceId || !targetId) return;
      if (!this.isValidDragTarget(sourceId, targetId)) return;

      const sourceNode = this.state.nodes$.value.find(n => n.id === sourceId)!;
      const targetNode = this.state.nodes$.value.find(n => n.id === targetId)!;
      const edge = this.defaults.createEdge(sourceId, targetId, sourceNode.type, targetNode.type);
      this.state.addEdge(edge);
    });

    this.paper.on('link:pointerup', (linkView: dia.LinkView) => {
      this._menuJustOpened = false;
      this._pendingMenuParentId = null;
      const link = linkView.model;
      const isStateEdge = this.state.edges$.value.some(e => e.id === (link.id as string));
      if (!isStateEdge && !link.get('target')?.id) {
        link.remove();
      }
    });
  }

  private syncStateToGraph(): void {
    this.state.nodes$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe(nodes => {
      if (this._syncing) return;
      this._syncing = true;
      this.diffNodes(nodes);
      this._syncing = false;
    });

    this.state.edges$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe(edges => {
      if (this._syncing) return;
      this._syncing = true;
      this.diffEdges(edges);
      this._syncing = false;
      this.updateStartButtonVisibility();
    });
  }

  private syncValidation(): void {
    combineLatest([this.state.nodes$, this.state.edges$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([nodes, edges]) => {
        this.validationErrors = this.validation.validate(nodes, edges);
        if (this.validationErrors.length === 0) {
          this.showErrorPanel = false;
        }
        this.cdr.markForCheck();
      });
  }

  private syncSelectionVisual(): void {
    this.state.selectedNodeId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(selectedId => {
      for (const el of this.graph.getElements()) {
        const node = this.state.nodes$.value.find(n => n.id === el.id);
        if (el.id === selectedId) {
          const selectedBorderColor = this.getSelectedNodeBorderColor(node);
          el.attr('body/stroke', selectedBorderColor);
          el.attr('body/strokeOpacity', 1);
          el.attr('body/strokeWidth', 1);
          el.attr('body/style', `filter: drop-shadow(0 0 1px ${selectedBorderColor});`);
          if (node?.type === AgentNodeType.Agent) {
            this.showAgentControls(el.id as string);
          }
        } else {
          const hasError = node ? this.isAgentNodeError(node) : false;
          el.attr('body/stroke', hasError ? ERROR_COLOR : BODY_BORDER);
          el.attr('body/strokeOpacity', hasError ? 0.5 : 1);
          el.attr('body/strokeWidth', 1);
          el.attr('body/style', hasError ? `filter: drop-shadow(0 0 1px ${ERROR_COLOR});` : '');
          if (node?.type === AgentNodeType.Agent) {
            this.scheduleAgentAddHide(el.id as string);
          }
        }
      }
      this.zone.run(() => {
        if (!selectedId) {
          this.hideNodeActions(this.nodeActionsNodeId);
          this.hideHoverNodeActions(this.hoverNodeActionsNodeId);
          return;
        }
        const selectedNode = this.state.nodes$.value.find(n => n.id === selectedId);
        if (selectedNode?.type === AgentNodeType.Agent || selectedNode?.type === AgentNodeType.End) {
          this.showNodeActions(selectedId);
          return;
        }
        if (this.nodeActionsNodeId) {
          this.hideNodeActions(this.nodeActionsNodeId);
        }
      });
    });
  }

  private setAgentAddButtonVisibility(nodeId: string, visible: boolean): void {
    const cell = this.graph.getCell(nodeId);
    if (!(cell instanceof dia.Element)) return;
    const opacity = visible ? 1 : 0;
    cell.attr('addButtonBg/visibility', 'visible');
    cell.attr('addButtonIcon/visibility', 'visible');
    cell.attr('addButtonBg/opacity', opacity);
    cell.attr('addButtonIcon/opacity', opacity);
    cell.attr('addButtonBg/pointerEvents', visible ? 'auto' : 'none');
  }

  private showAgentControls(nodeId: string): void {
    this.clearAgentAddHideTimer(nodeId);
    this.setAgentAddButtonVisibility(nodeId, true);
    this.showNodeActions(nodeId);
  }

  private clearAgentAddHideTimer(nodeId: string): void {
    const timer = this._agentAddHideTimeouts.get(nodeId);
    if (!timer) return;
    clearTimeout(timer);
    this._agentAddHideTimeouts.delete(nodeId);
  }

  private scheduleAgentAddHide(nodeId: string): void {
    this.clearAgentAddHideTimer(nodeId);
    const timer = setTimeout(() => {
      if (this.state.selectedNodeId$.value === nodeId) return;
      this.setAgentAddButtonVisibility(nodeId, false);
      this.hideNodeActions(nodeId);
      this.hideHoverNodeActions(nodeId);
      this._agentAddHideTimeouts.delete(nodeId);
    }, this._agentAddHideDelayMs);
    this._agentAddHideTimeouts.set(nodeId, timer);
  }

  private showNodeActions(nodeId: string): void {
    const node = this.state.nodes$.value.find(n => n.id === nodeId);
    if (node?.type !== AgentNodeType.Agent && node?.type !== AgentNodeType.End) return;
    if (this._nodeActionsFadeOutTimeout) {
      clearTimeout(this._nodeActionsFadeOutTimeout);
      this._nodeActionsFadeOutTimeout = null;
    }
    this.computeNodeActions(nodeId);
    this.nodeActionsVisible = true;
    this.cdr.markForCheck();
  }

  private showHoverNodeActions(nodeId: string): void {
    const node = this.state.nodes$.value.find(n => n.id === nodeId);
    if (node?.type !== AgentNodeType.Agent && node?.type !== AgentNodeType.End) return;
    if (this.nodeActionsNodeId === nodeId) return;
    if (this._hoverNodeActionsFadeOutTimeout) {
      clearTimeout(this._hoverNodeActionsFadeOutTimeout);
      this._hoverNodeActionsFadeOutTimeout = null;
    }
    this.computeHoverNodeActions(nodeId);
    this.hoverNodeActionsVisible = true;
    this.cdr.markForCheck();
  }

  private hideNodeActions(nodeId: string): void {
    if (this.nodeActionsNodeId !== nodeId) return;
    this.nodeActionsVisible = false;
    this.cdr.markForCheck();

    if (this._nodeActionsFadeOutTimeout) {
      clearTimeout(this._nodeActionsFadeOutTimeout);
    }
    this._nodeActionsFadeOutTimeout = setTimeout(() => {
      if (this.nodeActionsVisible) return;
      if (this.nodeActionsNodeId !== nodeId) return;
      if (this.state.selectedNodeId$.value === nodeId) return;
      this.nodeActionsNodeId = null;
      this.nodeActionsPos = null;
      this._nodeActionsFadeOutTimeout = null;
      this.cdr.markForCheck();
    }, this._nodeActionsFadeMs);
  }

  private hideHoverNodeActions(nodeId: string | null): void {
    if (!nodeId || this.hoverNodeActionsNodeId !== nodeId) return;
    this.hoverNodeActionsVisible = false;
    this.cdr.markForCheck();

    if (this._hoverNodeActionsFadeOutTimeout) {
      clearTimeout(this._hoverNodeActionsFadeOutTimeout);
    }
    this._hoverNodeActionsFadeOutTimeout = setTimeout(() => {
      if (this.hoverNodeActionsVisible) return;
      if (this.hoverNodeActionsNodeId !== nodeId) return;
      this.hoverNodeActionsNodeId = null;
      this.hoverNodeActionsPos = null;
      this._hoverNodeActionsFadeOutTimeout = null;
      this.cdr.markForCheck();
    }, this._nodeActionsFadeMs);
  }

  public onNodeActionsMouseEnter(): void {
    if (!this.nodeActionsNodeId) return;
    const node = this.state.nodes$.value.find(n => n.id === this.nodeActionsNodeId);
    if (node?.type === AgentNodeType.Agent) {
      this.showAgentControls(this.nodeActionsNodeId);
    } else {
      this.showNodeActions(this.nodeActionsNodeId);
    }
  }

  public onNodeActionsMouseLeave(): void {
    if (!this.nodeActionsNodeId) return;
    if (this.state.selectedNodeId$.value === this.nodeActionsNodeId) return;
    this.scheduleAgentAddHide(this.nodeActionsNodeId);
  }

  public onHoverNodeActionsMouseEnter(nodeId: string): void {
    this.clearAgentAddHideTimer(nodeId);
    this.setAgentAddButtonVisibility(nodeId, true);
    this.showHoverNodeActions(nodeId);
  }

  public onHoverNodeActionsMouseLeave(nodeId: string): void {
    if (this.state.selectedNodeId$.value === nodeId) return;
    this.scheduleAgentAddHide(nodeId);
  }

  private getNodeActionsPos(nodeId: string): { x: number; y: number } | null {
    const el = this.graph.getCell(nodeId);
    if (!(el instanceof dia.Element)) return null;
    const pos = (el as dia.Element).position();
    const size = (el as dia.Element).size();
    const pagePoint = this.paper.localToPagePoint(pos.x + size.width, pos.y);
    const wrapperRect = this.paperContainer.nativeElement.parentElement!.getBoundingClientRect();
    return { x: pagePoint.x - wrapperRect.left + 12, y: pagePoint.y - wrapperRect.top };
  }

  private computeNodeActions(nodeId: string | null): void {
    this.nodeActionsNodeId = nodeId;
    if (!nodeId) { this.nodeActionsPos = null; this.cdr.markForCheck(); return; }
    this.nodeActionsPos = this.getNodeActionsPos(nodeId);
    if (!this.nodeActionsPos) {
      this.nodeActionsNodeId = null;
      this.cdr.markForCheck();
      return;
    }
    if (this.hoverNodeActionsNodeId === nodeId) {
      this.hideHoverNodeActions(nodeId);
    }
    this.cdr.markForCheck();
  }

  private computeHoverNodeActions(nodeId: string | null): void {
    this.hoverNodeActionsNodeId = nodeId;
    if (!nodeId) { this.hoverNodeActionsPos = null; this.cdr.markForCheck(); return; }
    this.hoverNodeActionsPos = this.getNodeActionsPos(nodeId);
    if (!this.hoverNodeActionsPos) {
      this.hoverNodeActionsNodeId = null;
      this.cdr.markForCheck();
      return;
    }
    this.cdr.markForCheck();
  }

  public duplicateNode(nodeId: string): void {
    if (!nodeId || nodeId === 'start-node') return;
    this.state.duplicateNode(nodeId);
  }

  public deleteNode(nodeId: string): void {
    if (!nodeId || nodeId === 'start-node') return;
    this.state.deleteNode(nodeId);
    if (this.nodeActionsNodeId === nodeId) {
      this.nodeActionsPos = null;
      this.nodeActionsNodeId = null;
      this.nodeActionsVisible = false;
    }
    if (this.hoverNodeActionsNodeId === nodeId) {
      this.hoverNodeActionsPos = null;
      this.hoverNodeActionsNodeId = null;
      this.hoverNodeActionsVisible = false;
    }
    this.cdr.markForCheck();
  }

  private syncEdgeSelectionVisual(): void {
    this.state.selectedEdgeId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(edgeId => {
      for (const link of this.graph.getLinks()) {
        (link as any).updateAppearance?.();
      }
      if (edgeId) {
        const link = this.graph.getCell(edgeId);
        if (link) {
          const labels = (link as dia.Link).labels();
          if (labels.length > 0) {
            const firstLabel = labels[0] || {};
            const labelAttrs = firstLabel.attrs || {};

            (link as dia.Link).labels([
              {
                ...firstLabel,
                attrs: {
                  ...labelAttrs,
                  labelBody: {
                    ...labelAttrs['labelBody'],
                    stroke: SELECTED_BORDER,
                    strokeWidth: 2,
                    style: {
                      filter: `drop-shadow(0 0 1px ${SELECTED_BORDER})`,
                    },
                  },
                },
              },
            ]);
          }
        }
      }
      this.zone.run(() => this.computeEdgeActions(edgeId));
    });
  }

  private computeEdgeActions(edgeId: string | null): void {
    if (!edgeId) { this.hideEdgeActions(); return; }

    const edge = this.state.edges$.value.find(e => e.id === edgeId);
    if (!edge) { this.hideEdgeActions(); return; }

    const linkModel = this.graph.getCell(edgeId) as dia.Link;
    const linkView = this.paper.findViewByModel(linkModel) as dia.LinkView;
    if (!linkView) { this.hideEdgeActions(); return; }
    const labelsEl = (linkView.el as Element).querySelector('.labels') as SVGElement | null;
    if (!labelsEl) { this.hideEdgeActions(); return; }
    const labelRect = labelsEl.getBoundingClientRect();
    const wrapperRect = this.paperContainer.nativeElement.parentElement!.getBoundingClientRect();

    if (this._edgeActionsFadeOutTimeout) {
      clearTimeout(this._edgeActionsFadeOutTimeout);
      this._edgeActionsFadeOutTimeout = null;
    }
    this.edgeActionsEdgeId = edgeId;
    this.edgeActionsPos = {
      x: labelRect.right - wrapperRect.left + 8,
      y: labelRect.top - wrapperRect.top + labelRect.height / 2 - 12,
    };
    this.edgeActionsVisible = true;
    this.cdr.markForCheck();
  }

  private hideEdgeActions(): void {
    this.edgeActionsVisible = false;
    this.cdr.markForCheck();
    if (this._edgeActionsFadeOutTimeout) clearTimeout(this._edgeActionsFadeOutTimeout);
    this._edgeActionsFadeOutTimeout = setTimeout(() => {
      this.edgeActionsEdgeId = null;
      this.edgeActionsPos = null;
      this._edgeActionsFadeOutTimeout = null;
      this.cdr.markForCheck();
    }, this._nodeActionsFadeMs);
  }

  public onEdgeActionsMouseEnter(): void {
    if (this._edgeActionsHoverHideTimeout) {
      clearTimeout(this._edgeActionsHoverHideTimeout);
      this._edgeActionsHoverHideTimeout = null;
    }
  }

  public onEdgeActionsMouseLeave(): void {
    if (this.state.selectedEdgeId$.value === this.edgeActionsEdgeId) return;
    this._edgeActionsHoverHideTimeout = setTimeout(() => {
      this._edgeActionsHoverHideTimeout = null;
      if (this.state.selectedEdgeId$.value === this.edgeActionsEdgeId) return;
      this.zone.run(() => this.hideEdgeActions());
    }, this._edgeActionsHoverHideDelayMs);
  }

  public isEndNode(nodeId: string | null): boolean {
    if (!nodeId) return false;
    return this.state.nodes$.value.find(n => n.id === nodeId)?.type === AgentNodeType.End;
  }

  public deleteSelectedEdge(): void {
    if (!this.edgeActionsEdgeId) return;
    this.state.deleteEdge(this.edgeActionsEdgeId);
    this.state.setSelectedEdge(null);
    this.hideEdgeActions();
  }

  private getAllowedTargetType(sourceId: string): 'agent' | 'end' | null {
    const outgoing = this.state.edges$.value.filter(e => e.source === sourceId);
    if (outgoing.length === 0) return null;
    const firstTarget = this.state.nodes$.value.find(n => n.id === outgoing[0].target);
    if (!firstTarget) return null;
    return firstTarget.type === AgentNodeType.End ? 'end' : 'agent';
  }

  private isValidDragTarget(sourceId: string, targetId: string): boolean {
    const sourceNode = this.state.nodes$.value.find(n => n.id === sourceId);
    const targetNode = this.state.nodes$.value.find(n => n.id === targetId);
    if (!sourceNode || !targetNode) return false;
    if (targetNode.type === AgentNodeType.Start) return false;
    if (sourceNode.type === AgentNodeType.End) return false;
    if (this.state.edges$.value.some(e => e.source === sourceId && e.target === targetId)) return false;
    const allowed = this.getAllowedTargetType(sourceId);
    if (allowed === 'agent' && targetNode.type === AgentNodeType.End) return false;
    if (allowed === 'end') return false;
    return true;
  }

  public canAddAgent(): boolean {
    return !!this.menuParentId;
  }

  public canAddEnd(): boolean {
    if (!this.menuParentId) return false;
    const outgoing = this.state.edges$.value.filter(e => e.source === this.menuParentId);
    return !outgoing.some(e => this.state.nodes$.value.find(n => n.id === e.target)?.type === AgentNodeType.End);
  }

  private diffNodes(nodes: FlowAgentNode[]): void {
    const graphCells = new Map(this.graph.getElements().map(el => [el.id as string, el]));
    const stateIds = new Set(nodes.map(n => n.id));

    for (const [id, cell] of graphCells) {
      if (!stateIds.has(id)) cell.remove();
    }

    const selectedId = this.state.selectedNodeId$.value;
    for (const node of nodes) {
      const existing = graphCells.get(node.id);
      if (!existing) {
        const ShapeClass = this.getShapeClass(node.type);
        if (!ShapeClass) continue;
        const shape = new ShapeClass({ id: node.id, position: node.position });
        if (node.data.label) shape.attr('label/text', node.data.label);
        this.applyNodeAttrs(shape, node);
        if (node.id === selectedId) {
          const selectedBorderColor = this.getSelectedNodeBorderColor(node);
          shape.attr('body/stroke', selectedBorderColor);
          shape.attr('body/strokeWidth', 2);
          shape.attr('body/style', `filter: drop-shadow(0 0 1px ${selectedBorderColor});`);
        }
        this.graph.addCell(shape);
      } else {
        const pos = existing.position();
        if (pos.x !== node.position.x || pos.y !== node.position.y) {
          existing.position(node.position.x, node.position.y);
        }
        existing.attr('label/text', node.data.label || '');
        this.applyNodeAttrs(existing, node);
        if (node.id === selectedId) {
          const selectedBorderColor = this.getSelectedNodeBorderColor(node);
          existing.attr('body/stroke', selectedBorderColor);
          existing.attr('body/strokeOpacity', 1);
          existing.attr('body/strokeWidth', 1);
          existing.attr('body/style', `filter: drop-shadow(0 0 1px ${selectedBorderColor});`);
        }
      }
    }
  }

  private isAgentNodeError(node: FlowAgentNode): boolean {
    if (node.type !== AgentNodeType.Agent) return false;
    const data = node.data as any;
    const edges = this.state.edges$.value;
    return !data.conversationGoal?.trim()
      || !edges.some(e => e.source === node.id)
      || !edges.some(e => e.target === node.id);
  }

  private getSelectedNodeBorderColor(node: FlowAgentNode | undefined): string {
    if (node?.type === AgentNodeType.Agent && this.isAgentNodeError(node)) {
      return ERROR_COLOR;
    }
    return SELECTED_BORDER;
  }

  private applyNodeAttrs(shape: dia.Element, node: FlowAgentNode): void {
    if (node.type === AgentNodeType.Tool) {
      const data = node.data as any;
      const tools: any[] = data.tools ?? [];
      const hasError = tools.length === 0;
      shape.attr('errorCircle/visibility', hasError ? 'visible' : 'hidden');
      shape.attr('errorBang/visibility', hasError ? 'visible' : 'hidden');
      const toolNames = tools.map((t: any) => t.name).join(', ');
      shape.attr('toolsList/text', toolNames);
      return;
    }
    if (node.type !== AgentNodeType.Agent) return;
    const data = node.data as any;
    const toolsCount = data.tools?.length ?? 0;
    const kbCount = data.knowledgeBases?.length ?? 0;
    const infoCount = data.infoCollection?.length ?? 0;
    shape.attr('badgeToolsText/text', `+${toolsCount}`);
    shape.attr('badgeKbText/text', `+${kbCount}`);
    shape.attr('badgeInfoText/text', `+${infoCount}`);
    const promptPreview = data.conversationGoal?.trim()
      || data.description?.trim()
      || this.transloco.translate('tabs.general.goal_placeholder');
    shape.attr('subtitle/text', promptPreview);

    const hasError = this.isAgentNodeError(node);
    shape.attr('avatarErrorDot/visibility', hasError ? 'visible' : 'hidden');
    if (node.id !== this.state.selectedNodeId$.value) {
      shape.attr('body/stroke', hasError ? ERROR_COLOR : BODY_BORDER);
      shape.attr('body/strokeOpacity', hasError ? 0.5 : 1);
      shape.attr('body/style', hasError ? `filter: drop-shadow(0 0 1px ${ERROR_COLOR});` : '');
    }
  }

  private updateStartButtonVisibility(): void {
    const startEl = this.graph.getElements().find(el => el.id === 'start-node');
    if (!startEl) return;
    const hasChild = this.state.edges$.value.some(e => e.source === 'start-node');
    const visibility = hasChild ? 'hidden' : 'visible';
    startEl.attr('addButtonBg/visibility', visibility);
    startEl.attr('addButtonIcon/visibility', visibility);
  }

  private diffEdges(edges: FlowAgentEdge[]): void {
    const graphLinks = new Map(this.graph.getLinks().map(l => [l.id as string, l]));
    const stateIds = new Set(edges.map(e => e.id));

    for (const [id, link] of graphLinks) {
      if (!stateIds.has(id)) link.remove();
    }

    for (const edge of edges) {
      if (!graphLinks.has(edge.id)) {
        const link = new (shapes as any).agentApp.Link({
          id: edge.id,
          source: { id: edge.source, port: 'out-port' },
          target: { id: edge.target, port: 'in-port' },
          edgeData: edge.data,
        });
        this.graph.addCell(link);
      } else {
        graphLinks.get(edge.id)!.set('edgeData', edge.data);
      }
    }
  }

  private getShapeClass(type: AgentNodeType): (new (...args: unknown[]) => dia.Element) | undefined {
    const map: Record<string, (new (...args: unknown[]) => dia.Element) | undefined> = {
      [AgentNodeType.Start]: (shapes as any).agentApp.StartNode,
      [AgentNodeType.Agent]: (shapes as any).agentApp.AgentNode,
      [AgentNodeType.Tool]: (shapes as any).agentApp.ToolNode,
      [AgentNodeType.SelectAgent]: (shapes as any).agentApp.SelectAgentNode,
      [AgentNodeType.End]: (shapes as any).agentApp.EndNode,
    };
    return map[type];
  }

  addChild(type: string): void {
    if (this.menuParentId) {
      const nodeType = type === 'agent' ? AgentNodeType.Agent : AgentNodeType.End;
      this.state.addChildNode(this.menuParentId, nodeType);
    }
    this.closeMenu();
  }

  public onWrapperClick(): void {
    if (this._preventNextClose) {
      this._preventNextClose = false;
      return;
    }
    this.closeMenu();
  }

  public closeMenu(): void {
    this.menuParentId = null;
    this.showFabMenu = false;
    this.showErrorPanel = false;
    this.cdr.detectChanges();
  }

  public toggleFabMenu(): void {
    this.showFabMenu = !this.showFabMenu;
    this.cdr.markForCheck();
  }

  public toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    this.cdr.markForCheck();
  }

  private wheelZoom(delta: number, localX: number, localY: number): void {
    this.cancelFocusAnimation();
    const step = delta > 0 ? 0.1 : -0.1;
    const { sx } = this.paper.scale();
    const newScale = Math.min(Math.max(sx + step, ZOOM_MIN), ZOOM_MAX);
    const { tx, ty } = this.paper.translate();
    this.paper.translate(tx + localX * (sx - newScale), ty + localY * (sx - newScale));
    this.paper.scale(newScale);
    this.zone.run(() => {
      this.zoomPercent.set(Math.round(newScale * 100));
      this.currentScale = newScale;
      if (this.nodeActionsNodeId) this.computeNodeActions(this.nodeActionsNodeId);
      if (this.edgeActionsEdgeId) this.computeEdgeActions(this.edgeActionsEdgeId);
      this.cdr.markForCheck();
    });
  }

  private refreshFloatingButtons(): void {
    this.currentScale = this.paper.scale().sx;
    if (this.nodeActionsNodeId) this.computeNodeActions(this.nodeActionsNodeId);
    if (this.hoverNodeActionsNodeId) this.computeHoverNodeActions(this.hoverNodeActionsNodeId);
    if (this.edgeActionsEdgeId) this.computeEdgeActions(this.edgeActionsEdgeId);
    this.cdr.markForCheck();
  }

  zoomIn(): void {
    this.cancelFocusAnimation();
    const s = Math.min(this.paper.scale().sx + 0.1, ZOOM_MAX);
    this.paper.scale(s);
    this.zoomPercent.set(Math.round(s * 100));
    this.refreshFloatingButtons();
  }

  zoomOut(): void {
    this.cancelFocusAnimation();
    const s = Math.max(this.paper.scale().sx - 0.1, ZOOM_MIN);
    this.paper.scale(s);
    this.zoomPercent.set(Math.round(s * 100));
    this.refreshFloatingButtons();
  }

  fitToScreen(): void {
    this.cancelFocusAnimation();
    const elements = this.graph.getElements();
    if (elements.length === 0) return;

    const pw = this.paperContainer.nativeElement.clientWidth;
    const ph = this.paperContainer.nativeElement.clientHeight;
    const availW = pw;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const el of elements) {
      const { x, y } = el.position();
      const { width, height } = el.size();
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + width > maxX) maxX = x + width;
      if (y + height > maxY) maxY = y + height;
    }

    const padding = 60;
    const cw = maxX - minX;
    const ch = maxY - minY;
    const scale = Math.min((availW - 2 * padding) / cw, (ph - 2 * padding) / ch, ZOOM_INITIAL);
    const s = Math.max(scale, ZOOM_MIN);

    const tx = (availW - cw * s) / 2 - minX * s;
    const ty = ph / 3 - (minY + ch / 2) * s;

    this.paper.scale(s);
    this.paper.translate(tx, ty);
    this.zoomPercent.set(Math.round(s * 100));
    this.refreshFloatingButtons();
  }

  centerOnStart(animated = true): void {
    this.cancelFocusAnimation();
    const start = this.graph.getElements().find(e => e.id === 'start-node');
    if (!start) { this.fitToScreen(); return; }
    const { x, y } = start.position();
    const { width, height } = start.size();
    const cw = this.paperContainer.nativeElement.clientWidth;
    const ch = this.paperContainer.nativeElement.clientHeight;
    const targetScale = 1;
    const targetTx = cw / 2 - (x + width / 2) * targetScale;
    const targetTy = ch / 3 - (y + height / 2) * targetScale;

    if (!animated) {
      this.paper.scale(targetScale);
      this.paper.translate(targetTx, targetTy);
      this.zoomPercent.set(100);
      this.refreshFloatingButtons();
      this.cdr.markForCheck();
      return;
    }

    this.animateViewportTransformTo(targetScale, targetTx, targetTy);
  }

  public focusOnTarget(id: string, type: 'node' | 'edge'): void {
    if (!id || !this.paper || !this.graph) return;

    if (type === 'node') {
      const nodeCell = this.graph.getCell(id);
      if (nodeCell instanceof dia.Element) {
        const pos = nodeCell.position();
        const size = nodeCell.size();
        this.centerViewportOnPoint(pos.x + size.width / 2, pos.y + size.height / 2);
      }
      return;
    }

    const edge = this.state.edges$.value.find(e => e.id === id);
    if (edge) {
      const sourceEl = this.graph.getCell(edge.source);
      const targetEl = this.graph.getCell(edge.target);
      if (sourceEl instanceof dia.Element && targetEl instanceof dia.Element) {
        const sp = sourceEl.position();
        const ss = sourceEl.size();
        const tp = targetEl.position();
        const ts = targetEl.size();
        const mx = (sp.x + ss.width / 2 + tp.x + ts.width / 2) / 2;
        const my = (sp.y + ss.height / 2 + tp.y + ts.height / 2) / 2;
        this.centerViewportOnPoint(mx, my);
      }
    }
  }

  private centerViewportOnPoint(localX: number, localY: number): void {
    const scale = this.paper.scale().sx;
    const cw = this.paperContainer.nativeElement.clientWidth;
    const ch = this.paperContainer.nativeElement.clientHeight;
    const targetTx = cw / 2 - localX * scale;
    const targetTy = ch / 2 - localY * scale;
    this.animateViewportTo(targetTx, targetTy);
  }

  private animateViewportTo(targetTx: number, targetTy: number): void {
    this.cancelFocusAnimation();

    const { tx: startTx, ty: startTy } = this.paper.translate();
    const deltaX = targetTx - startTx;
    const deltaY = targetTy - startTy;

    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
      this.paper.translate(targetTx, targetTy);
      this.refreshFloatingButtons();
      this.cdr.markForCheck();
      return;
    }

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / this._focusAnimationDurationMs, 1);
      const eased = 1 - (1 - raw) ** 3;
      this.paper.translate(startTx + deltaX * eased, startTy + deltaY * eased);

      if (raw < 1) {
        this._focusAnimationFrameId = requestAnimationFrame(step);
        return;
      }

      this._focusAnimationFrameId = null;
      this.refreshFloatingButtons();
      this.cdr.markForCheck();
    };

    this._focusAnimationFrameId = requestAnimationFrame(step);
  }

  private animateViewportTransformTo(targetScale: number, targetTx: number, targetTy: number): void {
    this.cancelFocusAnimation();

    const { sx: startScale } = this.paper.scale();
    const { tx: startTx, ty: startTy } = this.paper.translate();
    const deltaScale = targetScale - startScale;
    const deltaX = targetTx - startTx;
    const deltaY = targetTy - startTy;

    if (Math.abs(deltaScale) < 0.001 && Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
      this.paper.scale(targetScale);
      this.paper.translate(targetTx, targetTy);
      this.zoomPercent.set(Math.round(targetScale * 100));
      this.refreshFloatingButtons();
      this.cdr.markForCheck();
      return;
    }

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / this._focusAnimationDurationMs, 1);
      const eased = 1 - (1 - raw) ** 3;
      const nextScale = startScale + deltaScale * eased;

      this.paper.scale(nextScale);
      this.paper.translate(startTx + deltaX * eased, startTy + deltaY * eased);

      if (raw < 1) {
        this._focusAnimationFrameId = requestAnimationFrame(step);
        return;
      }

      this._focusAnimationFrameId = null;
      this.zoomPercent.set(Math.round(targetScale * 100));
      this.refreshFloatingButtons();
      this.cdr.markForCheck();
    };

    this._focusAnimationFrameId = requestAnimationFrame(step);
  }

  private cancelFocusAnimation(): void {
    if (this._focusAnimationFrameId === null) return;
    cancelAnimationFrame(this._focusAnimationFrameId);
    this._focusAnimationFrameId = null;
  }

  toggleErrorPanel(): void {
    this.menuParentId = null;
    this.showFabMenu = false;
    this.showErrorPanel = !this.showErrorPanel;
    this.cdr.markForCheck();
  }

  selectErrorTarget(id: string, type: 'node' | 'edge'): void {
    if (type === 'node') {
      this.state.setSelectedNode(id);
      this.state.setSelectedEdge(null);
    } else {
      this.state.setSelectedEdge(id);
      this.state.setSelectedNode(null);
    }
    this.showErrorPanel = false;
    this.cdr.markForCheck();
  }

  onSave(): void {}

  onSimulate(): void {}

  openDebugDialog(): void {
    const snapshot = this.state.getFlowSnapshot();
    this.debugJson.set(JSON.stringify(snapshot, null, 2));
    this.showDebugDialog.set(true);
  }

  downloadFlow(): void {
    const snapshot = this.state.getFlowSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snapshot.name || 'flow'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  applyDebugJson(): void {
    try {
      const data = JSON.parse(this.debugJson());
      this.state.setFlowData(data);
      this.showDebugDialog.set(false);
    } catch {
      // JSON inválido — no hacer nada
    }
  }
}
