import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldCreationModalComponent } from './field-creation-modal.component';

describe('FieldCreationModalComponent', () => {
  let fixture: ComponentFixture<FieldCreationModalComponent>;
  let component: FieldCreationModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldCreationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not create field when required data is missing', () => {
    const createdSpy = spyOn(component.created, 'emit');

    component.create();

    expect(component.canCreate).toBeFalse();
    expect(createdSpy).not.toHaveBeenCalled();
  });

  it('creates a field and resets form state', () => {
    const createdSpy = spyOn(component.created, 'emit');
    const closedSpy = spyOn(component.closed, 'emit');

    component.name.set('Telefono principal');
    component.description.set('Telefono para contacto inicial');
    component.dataType.set('Texto');
    component.length.set(20);

    component.create();

    expect(createdSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        label: 'Telefono principal',
        description: 'Telefono para contacto inicial',
        targetField: 'telefono_principal',
      }),
    );
    expect(closedSpy).toHaveBeenCalled();
    expect(component.name()).toBe('');
    expect(component.description()).toBe('');
    expect(component.length()).toBeNull();
  });
});
