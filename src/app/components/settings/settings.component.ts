import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  darkMode = false;
  notifications = {
    newForYou: { app: true, email: false, browser: true },
    accountActivity: { app: true, email: true, browser: false },
    newBrowser: { app: false, email: true, browser: true },
    newDevice: { app: true, email: true, browser: true }
  };
  originalNotifications: any;
  passwordForm: FormGroup;

  constructor(private titleService: TitleService, private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  saveGeneralSettings() {
    console.log('General settings saved');
    alert('General settings saved!');
  }

  savePreferences() {
    console.log('Preferences saved:', {
      darkMode: this.darkMode,
      notifications: this.notifications
    });
    alert('Preferences saved!');
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
      
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
      }
      
      console.log('Password change requested');
      alert('Password changed successfully!');
      this.passwordForm.reset();
    }
  }

  saveNotifications() {
    this.originalNotifications = JSON.parse(JSON.stringify(this.notifications));
    console.log('Notifications saved:', this.notifications);
    alert('Notification preferences saved!');
  }

  discardNotifications() {
    this.notifications = JSON.parse(JSON.stringify(this.originalNotifications));
    alert('Changes discarded!');
  }

  ngOnInit(): void {
    this.titleService.setTitle('Settings');
    this.originalNotifications = JSON.parse(JSON.stringify(this.notifications));
  }

}
