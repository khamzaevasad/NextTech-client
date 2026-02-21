import { Dispatch, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { NavItems } from "./NavItems";

interface MobileSidebarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
function MobileSidebar({ open, setOpen }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden bg-background"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-6 bg-background border-r">
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Access your dashboard, products, and account settings.
        </SheetDescription>
        <div className="flex items-center gap-2 mb-8 px-2">
          <Link href="/">
            <h1 className="font-bold text-3xl">
              Next<span className="text-special">Tech</span>
            </h1>
          </Link>
        </div>
        <NavItems onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;
