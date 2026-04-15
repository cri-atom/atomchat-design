import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequestModalComponent } from './http-request-modal.component';

describe('HttpRequestModalComponent', () => {
  let fixture: ComponentFixture<HttpRequestModalComponent>;
  let component: HttpRequestModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpRequestModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HttpRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not save when url is empty', () => {
    const savedSpy = spyOn(component.saved, 'emit');

    component.url.set('   ');
    component.save();

    expect(component.canSave).toBeFalse();
    expect(savedSpy).not.toHaveBeenCalled();
  });

  it('emits http config when url is valid', () => {
    const savedSpy = spyOn(component.saved, 'emit');
    const closedSpy = spyOn(component.closed, 'emit');

    component.method.set('POST');
    component.url.set('https://api.example.com/lead');
    component.hasHeaders.set(true);
    component.hasBody.set(true);
    component.save();

    const payload = savedSpy.calls.mostRecent().args[0];
    expect(savedSpy).toHaveBeenCalledTimes(1);
    expect(payload).toEqual(jasmine.objectContaining({
      method: 'POST',
      url: 'https://api.example.com/lead',
    }));
    expect(payload.headers).toEqual({});
    expect(payload.bodyTemplate).toBe('');
    expect(closedSpy).toHaveBeenCalled();
  });
});
