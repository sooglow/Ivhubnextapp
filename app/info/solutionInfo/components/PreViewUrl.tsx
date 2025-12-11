"use client";

import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { PreViewUrlProps } from "@/app/info/solutionInfo/types/List";

function PreViewUrl({ preViewUrl, open, setOpen }: PreViewUrlProps) {
  useEffect(() => {
    if (preViewUrl) {
      setOpen(true);
    }
  }, [preViewUrl, setOpen]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[720px] overscroll-y-auto">
        <DialogHeader>
          <DialogTitle>솔루션 공지사항</DialogTitle>
        </DialogHeader>
        <embed src={preViewUrl} className="w-full h-[650px]" />
      </DialogContent>
    </Dialog>
  );
}

export default PreViewUrl;
