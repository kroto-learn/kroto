import { api } from "@/utils/api";

export default function Testing() {
  const { mutateAsync: sendEmail, isLoading } =
    api.emailReminder.sendDailyLearningReminder.useMutation();

  const { mutateAsync: updateStreak, isLoading: streakLoading } =
    api.emailReminder.updateDailyStreak.useMutation();
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <button
        className="rounded-lg border bg-neutral-700 p-5"
        onClick={() => void sendEmail()}
      >
        {isLoading ? "Sending..." : "Send Reminder"}
      </button>
      <button
        className="rounded-lg border bg-neutral-700 p-5"
        onClick={() => void updateStreak()}
      >
        {streakLoading ? "Streaking..." : "Update Streak"}
      </button>
    </div>
  );
}
