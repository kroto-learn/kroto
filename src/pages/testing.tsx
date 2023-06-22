import { api } from "@/utils/api";

export default function Testing() {
  const { mutateAsync: sendEmail, isLoading } =
    api.emailReminder.sendDailyLearningReminder.useMutation();
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        className="rounded-lg border bg-neutral-700 p-5"
        onClick={() => void sendEmail()}
      >
        {isLoading ? "Sending..." : "Send Reminder"}
      </button>
    </div>
  );
}
