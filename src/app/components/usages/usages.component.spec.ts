import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsagesComponent } from './usages.component';

describe('UsagesComponent', () => {
  let component: UsagesComponent;
  let fixture: ComponentFixture<UsagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsagesComponent]
    });
    fixture = TestBed.createComponent(UsagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
