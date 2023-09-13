import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { setupCourses } from "../common/setup-test-data";
import { CoursesService } from "../services/courses.service";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: CoursesService;
  const beginnerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );

  beforeEach(async () => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    await TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        {
          provides: CoursesService,
          useValue: coursesServiceSpy,
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    // coursesService.findAllCourses.and.
    // coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css("mat-mdc-tab-labels"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  xit("should display only advanced courses", () => {
    pending();
  });

  xit("should display both tabs", () => {
    pending();
  });

  xit("should display advanced courses when tab clicked", () => {
    pending();
  });
});
