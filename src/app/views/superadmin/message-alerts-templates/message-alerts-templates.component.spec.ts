import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAlertsTemplatesComponent } from './message-alerts-templates.component';

describe('MessageAlertsTemplatesComponent', () => {
  let component: MessageAlertsTemplatesComponent;
  let fixture: ComponentFixture<MessageAlertsTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageAlertsTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageAlertsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
