import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";

import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { setupCourses } from "../common/setup-test-data";
import { click } from "../common/test-utils";
import { CoursesService } from "../services/courses.service";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(
    (course) => course.category === "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category === "ADVANCED"
  );

  beforeEach(async () => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    await TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        {
          provide: CoursesService,
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
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mdc-tab"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });

  fit("should display advanced courses when tab clicked", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    console.log("tabs = ", tabs);

    click(tabs[1]);

    fixture.detectChanges();

    // 因為 mat-tab 套件，在點擊切換渲染dom時
    // 會呼叫 window.requestAnimationFrame()
    // 此時會在 16 毫秒後再執行callback
    // 因此需要用 setTimeout 來解，不然就算 detectChanges 刷新後
    // 還是會抓到舊的dom
    setTimeout(() => {
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );

      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );

      done();
    }, 1500);
  });
});
