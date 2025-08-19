import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedjobcardsComponent } from './closedjobcards.component';

describe('ClosedjobcardsComponent', () => {
  let component: ClosedjobcardsComponent;
  let fixture: ComponentFixture<ClosedjobcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosedjobcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedjobcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
