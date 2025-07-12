export interface MessagingPort {
  emit(topic: string, message: any): Promise<void>;
}
