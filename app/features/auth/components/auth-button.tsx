import { GithubIcon, LockIcon, MessageCircleIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/common/components/ui/hover-card";
import { Separator } from "~/common/components/ui/separator";

export default function AuthButtons() {
  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="w-full flex flex-col items-center gap-2">
        <Separator className="w-full" />
        <span className="text-xs text-muted-foreground uppercase font-medium">
          Or continue with
        </span>
        <Separator className="w-full" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/auth/social/kakao/start">
            <MessageCircleIcon className="w-4 h-4" />
            Kakao Talk
          </Link>
        </Button>
        <HoverCard>
          <HoverCardTrigger>
            <Button className="w-full" disabled>
              <Link to="/auth/otp/start" className="flex items-center gap-1">
                <LockIcon className="w-4 h-4" />
                OTP
              </Link>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="flex w-64 flex-col gap-0.5">
            <div className="text-sm">준비중입니다...</div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
