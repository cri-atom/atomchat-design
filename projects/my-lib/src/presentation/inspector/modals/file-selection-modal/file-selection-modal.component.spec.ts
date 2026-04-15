import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileSelectionModalComponent } from './file-selection-modal.component';

describe('FileSelectionModalComponent', () => {
  let fixture: ComponentFixture<FileSelectionModalComponent>;
  let component: FileSelectionModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filters files by search query', () => {
    component.search.set('faq');

    expect(component.filteredFiles().length).toBe(1);
    expect(component.filteredFiles()[0].name.toLowerCase()).toContain('faq');
  });

  it('toggles a file and confirms selected knowledge bases', () => {
    const savedSpy = spyOn(component.saved, 'emit');
    const closedSpy = spyOn(component.closed, 'emit');
    const file = component.files()[0];

    component.toggleFile(file);
    expect(component.isSelected(file)).toBeTrue();

    component.confirm();

    expect(savedSpy).toHaveBeenCalledWith([
      jasmine.objectContaining({
        id: file.id,
        name: file.name,
        fileName: file.name,
      }),
    ]);
    expect(closedSpy).toHaveBeenCalled();
  });

  it('selects and clears all filtered files', () => {
    component.search.set('docx');

    component.toggleAll(true);
    expect(component.allSelected).toBeTrue();

    component.toggleAll(false);
    expect(component.tempSelected().length).toBe(0);
  });
});
