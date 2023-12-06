import { CheckIcon } from "@radix-ui/react-icons";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
interface Props {
  icon?: boolean;
  time: number | Date;
  messageSeen?: boolean;
}
const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

export default function Timestamp({ icon, time, messageSeen }: Props) {
  return (
    <div className="flex space-x-1">
      {icon && <CheckIcon className="text-muted-foreground/50" fontSize={32} />}
      <p className={`text-xs text-muted-foreground/50`}>
        {formatRelative(new Date(time), new Date(time), {
          locale: {
            ...enUS,
            formatRelative: (token) =>
              formatRelativeLocale[token as keyof typeof formatRelativeLocale],
          },
        })}
      </p>
    </div>
  );
}
