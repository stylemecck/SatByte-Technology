import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateCheck } from '@/hooks/useUpdateCheck';

export function UpdateModal() {
  const { updateAvailable, latestVersion } = useUpdateCheck();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setOpen(true);
    }
  }, [updateAvailable]);

  const handleUpdate = () => {
    // Replace with your actual download URL or Play Store link
    window.open('https://satbyte.in/download', '_blank');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Available</DialogTitle>
          <DialogDescription>
            A new version ({latestVersion}) of SatByte Technology is available.
            Please update to get the latest features and fixes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Later
          </Button>
          <Button onClick={handleUpdate}>
            Update Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
