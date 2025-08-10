import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ui5Input } from './ui5-input';

describe('Ui5Input', () => {
  let component: Ui5Input;
  let fixture: ComponentFixture<Ui5Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ui5Input]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ui5Input);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
