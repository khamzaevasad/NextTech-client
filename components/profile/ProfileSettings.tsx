"use client";

import React, { useRef, useState } from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import {
  MEMBER_IMAGE_UPLOADER,
  UPDATE_MEMBER,
} from "@/apollo/user/user-mutation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload } from "lucide-react";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { updateStorage, updateUserInfo } from "@/lib/auth";

export default function ProfileSettings() {
  const user = useReactiveVar(userVar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // memberFullName: user.memberFullName ?? "",
    memberNick: user.memberNick ?? "",
    memberPhone: user.memberPhone ?? "",
    memberAddress: user.memberAddress ?? "",
    memberDesc: user.memberDesc ?? "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [uploadImage] = useMutation(MEMBER_IMAGE_UPLOADER);
  const [updateMember] = useMutation(UPDATE_MEMBER);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      let memberImage = user.memberImage;

      if (imageFile) {
        const { data } = await uploadImage({
          variables: { file: imageFile, target: "member" },
        });
        memberImage = data?.imageUploader;
      }

      const { data } = await updateMember({
        variables: {
          input: {
            ...formData,
            memberImage,
          },
        },
      });

      const updated = data?.updateMember;
      if (!updated?.accessToken) return;

      updateStorage({ jwtToken: updated.accessToken });
      updateUserInfo(updated.accessToken);
      toast.success("Profile updated");
    } catch (err) {
      toast("Update failed");
      console.error(err);
    }
  };

  return (
    <div className="my-8">
      <div>
        <h2 className="text-4xl font-semibold my-6 text-center">Settings</h2>
      </div>
      <div className="space-y-10">
        {/* ================= Photo Section ================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Camera className="size-4" />
            Profile Photo
          </div>

          <div className="flex items-center gap-6 border rounded p-6">
            <Avatar className="size-28">
              <AvatarImage
                src={imagePreview || `${API_URL}/${user.memberImage}`}
              />
              <AvatarFallback>{user.memberNick?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4 mr-2" />
                Change image
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, Webp recommended
              </p>
            </div>
          </div>
        </section>

        {/* ================= Form Section ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div className="space-y-1">
          <Label>Full name</Label>
          <Input
            value={formData.memberFullName}
            onChange={(e) =>
              setFormData({ ...formData, memberFullName: e.target.value })
            }
          />
        </div> */}

          <div className="space-y-1">
            <Label>Nickname</Label>
            <Input
              value={formData.memberNick}
              onChange={(e) =>
                setFormData({ ...formData, memberNick: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <Label>Phone</Label>
            <Input
              value={formData.memberPhone}
              onChange={(e) =>
                setFormData({ ...formData, memberPhone: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <Label>Address</Label>
            <Input
              value={formData.memberAddress}
              onChange={(e) =>
                setFormData({ ...formData, memberAddress: e.target.value })
              }
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={formData.memberDesc}
              onChange={(e) =>
                setFormData({ ...formData, memberDesc: e.target.value })
              }
            />
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={handleUpdate}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
