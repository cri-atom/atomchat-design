import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolSelectionModalComponent } from './tool-selection-modal.component';

describe('ToolSelectionModalComponent', () => {
  let fixture: ComponentFixture<ToolSelectionModalComponent>;
  let component: ToolSelectionModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens toolkit connection step for disconnected toolkits', () => {
    const github = component.toolkits.find(t => t.id === 'github');
    expect(github).toBeDefined();

    component.selectToolkit(github!);

    expect(component.step()).toBe('CONNECT_TOOLKIT');
    expect(component.selectedToolkit()?.id).toBe('github');
  });

  it('saves selected tools for connected toolkit', () => {
    const savedSpy = spyOn(component.saved, 'emit');
    const closedSpy = spyOn(component.closed, 'emit');

    const gmail = component.toolkits.find(t => t.id === 'gmail');
    component.selectToolkit(gmail!);

    const firstTool = component.filteredTools()[0];
    component.toggleTool(firstTool);
    component.confirm();

    expect(component.step()).toBe('SELECT_TOOLS');
    expect(savedSpy).toHaveBeenCalledTimes(1);
    expect(savedSpy).toHaveBeenCalledWith([
      jasmine.objectContaining({
        id: firstTool.id,
        toolkitSlug: 'gmail',
        toolSlug: firstTool.id,
      }),
    ]);
    expect(closedSpy).toHaveBeenCalled();
  });
});
