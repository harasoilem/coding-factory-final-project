import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.scss']
})
export class FlatButtonComponent implements OnInit {

  @Input() label: string | undefined;
  @Input() hasIcon: boolean = false;
  @Input() enableHoverColor: boolean = false;
  @Input() iconName: string | undefined;
  @Input() routerLink: string | undefined;
  @Output() clickEvent = new EventEmitter<any>();
  @Input() extraClasses: string;
  @Input() iconExtraClasses: string;
  @Input() textColorClass: string;
  @Input() isLoading: boolean = false;

  constructor(private router: Router,) {
  }

  ngOnInit(): void {
  }

  async onClick() {
    if (this.routerLink === undefined) {
      await this.clickEvent.emit();
    } else {
      await this.router.navigate([this.routerLink]);
    }
  }

  getExtraClasses() {
    let classesToReturn = this.extraClasses ?? '';

    if (classesToReturn.indexOf(' p-') === -1 && classesToReturn.indexOf(' px-') === -1 && classesToReturn.indexOf(' py-') === -1) {
      classesToReturn += ' px-4 py-2 ';
    }

    classesToReturn += this.getTextColorClass()

    if (this.enableHoverColor) {
      classesToReturn += ' hover:bg-app-primary';
    }
    return classesToReturn
  }

  getIconExtraClasses() {
    const opacity = this.isLoading ? ' opacity-0' : '';
    return this.iconExtraClasses + opacity;
  }

  getTextColorClass(): string {
    if (this.textColorClass) {
      return ' ' + this.textColorClass;
    } else {
      return ' text-white';
    }
  }

}
