import { Button } from "@shared/components/ui/button";
import { services } from "@shared/lib/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export const AddSoundButton = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const createSound = useMutation({
    ...services.sound.mutation.createSound,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sounds"] });
    },
  });

  const handleAddSound = async () => {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Audio",
          extensions: ["mp3", "wav", "ogg", "m4a", "aac"],
        },
      ],
    });

    if (!selected || Array.isArray(selected)) return;

    setIsUploading(true);
    try {
      const data = await invoke<number[]>("read_sound_file", {
        filePath: selected,
      });

      const fileName = selected.split(/[\\/]/).pop() || "unnamed_sound";

      const savedPath = await invoke<string>("save_sound", {
        fileName,
        data,
      });

      createSound.mutate({
        name: fileName.split(".").slice(0, -1).join("."), // Remove extension for display name
        file_name: savedPath,
      });
    } catch (error) {
      console.error("Failed to save sound:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button
      onClick={handleAddSound}
      disabled={isUploading}
      size="icon"
    >
      <Plus />
    </Button>
  );
};
