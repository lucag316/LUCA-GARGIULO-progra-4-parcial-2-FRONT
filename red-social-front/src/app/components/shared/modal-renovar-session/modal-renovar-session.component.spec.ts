import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRenovarSessionComponent } from './modal-renovar-session.component';

describe('ModalRenovarSessionComponent', () => {
  let component: ModalRenovarSessionComponent;
  let fixture: ComponentFixture<ModalRenovarSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRenovarSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRenovarSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
