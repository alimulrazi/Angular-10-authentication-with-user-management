import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  darkMode = false;
  notifications = true;

  constructor(private titleService: TitleService) { }

  saveSettings() {
    console.log('Settings saved:', {
      darkMode: this.darkMode,
      notifications: this.notifications
    });
    alert('Settings saved!');
  }

  ngOnInit(): void {
    this.titleService.setTitle('Settings');
  }

}
