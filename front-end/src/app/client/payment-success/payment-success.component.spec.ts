import { ComponentFixture, TestBed } from '@angular/core/testing';
// تصحيح الاستيراد واسم الكلاس
import { PaymentSuccessComponent } from './payment-success.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ضروري للاختبارات التي فيها Services
import { RouterTestingModule } from '@angular/router/testing'; // ضروري للـ Router

describe('PaymentSuccessComponent', () => {
  let component: PaymentSuccessComponent;
  let fixture: ComponentFixture<PaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaymentSuccessComponent,
        HttpClientTestingModule, // محاكاة الاتصال بالسيرفر
        RouterTestingModule // محاكاة التوجيه
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
