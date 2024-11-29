import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  @Input() title: string = '';
  userQuestion: string = '';
  chatMessages: { author: string; content: string }[] = [];
  uploadedFile: File | null = null;
  isLoading: boolean = false;
  uploadedFileName: string | null = null;
  isTextError: boolean = false
  constructor(private http: HttpClient) {}

  // Triggered when a file is uploaded
  onFileUpload(event: any): void {
    const file = event.files[0];
    this.uploadedFile = file;
    this.chatMessages = [];
    if (event.files && event.files.length > 0) {
      // Store the name of the first selected file
      this.uploadedFileName = event.files[0].name;
    }
  }

  // Submits the question and file to the backend
  submitQuestion(): void {
    if (!this.userQuestion.trim() || !this.uploadedFile) {
      this.isTextError = true
      return;
    }
    this.isTextError = false
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.uploadedFile);
    formData.append('question', this.userQuestion);

    this.http.post('http://localhost:3000/process-pdf', formData).subscribe({
      next: (response: any) => {
        const answer = response.response; // Assume backend responds with an "answer"
        this.chatMessages.push({ author: 'You:', content: this.userQuestion });
        this.chatMessages.push({ author: 'AI:', content: answer.replace('Bot:', '') });
        this.userQuestion = ''; // Clear input
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.isLoading = false;
        console.error('Error submitting question:', error);
        alert('Failed to send the question to the backend.');
      },
    });
  }
}
