import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private baseTitle = 'Buddi Dashboard';

  constructor(private titleService: Title) { }

  setTitle(title: string): void {
    this.titleService.setTitle(`${title} - ${this.baseTitle}`);
  }
}