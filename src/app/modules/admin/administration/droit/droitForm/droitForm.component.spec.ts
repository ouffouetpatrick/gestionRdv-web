/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DroitFormComponent } from './droitForm.component';

describe('DroitFormComponent', () => {
  let component: DroitFormComponent;
  let fixture: ComponentFixture<DroitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
