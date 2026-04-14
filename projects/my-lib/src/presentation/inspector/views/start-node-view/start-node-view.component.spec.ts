/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartNodeViewComponent } from './start-node-view.component';

describe('StartNodeViewComponent', () => {
  let fixture: ComponentFixture<StartNodeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartNodeViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartNodeViewComponent);
    fixture.detectChanges();
  });

  it('renders workflow entry guidance text', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('entry point of the workflow');
    expect(text).toContain('All conversations begin here');
  });
});
