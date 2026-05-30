import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTaskDetailsComponent } from './customer-task-details.component';

describe('CustomerTaskDetailsComponent', () => {
  let component: CustomerTaskDetailsComponent;
  let fixture: ComponentFixture<CustomerTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTaskDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
