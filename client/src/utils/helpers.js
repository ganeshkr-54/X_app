import { formatDistanceToNowStrict } from "date-fns";

export function formatDate(date) {
    return formatDistanceToNowStrict(new Date(date))
}
