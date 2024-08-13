import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '@services/settings/settings.service';
import {environment} from "@env/environment";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  settingsForm!: FormGroup;
  currentSetting: any;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    this.settingsForm = this.fb.group({
      title: [''],
      subtitle: [''],
      banner: [null]
    });

    this.loadSettings();
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe(response => {
      if (response.status) {
        this.currentSetting = response.data;
        this.settingsForm.patchValue(this.currentSetting);
        if (this.currentSetting.banner) {
          this.previewUrl = `${environment.api.replace('/api', '')}/storage/` + this.currentSetting.banner;
        }
      } else {
        // Handle error
        console.error(response.error);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.settingsForm.patchValue({ banner: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      // Handle invalid file type
      console.error('O arquivo selecionado não é uma imagem.');
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      this.onFileChange({ target: { files: [files[0]] } });
    }
  }

  clearImage() {
    this.settingsForm.patchValue({ banner: null });
    this.previewUrl = null;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.settingsForm.get('title')?.value);
    formData.append('subtitle', this.settingsForm.get('subtitle')?.value);
    if (this.settingsForm.get('banner')?.value) {
      formData.append('banner', this.settingsForm.get('banner')?.value);
    }

    this.settingsService.updateSettings(formData).subscribe(response => {
      if (response.status) {
        // Sucesso
        console.log(response.message);
        window.location.reload();
      } else {
        // Handle error
        console.error(response.error);
      }
    });
  }
}
