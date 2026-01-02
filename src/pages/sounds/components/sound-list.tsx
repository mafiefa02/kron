import { NoDataIllustration } from "@shared/components/illustrations/no-data";
import { WarningIllustration } from "@shared/components/illustrations/warning";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Skeleton } from "@shared/components/ui/skeleton";
import { Slider } from "@shared/components/ui/slider";
import { useDebounce } from "@shared/lib/hooks";
import { services } from "@shared/lib/services";
import { cn, minutesToTime } from "@shared/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { Edit, Loader2, Music, Pause, Play, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchContext } from "../contexts/search-context";

export const SoundList = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { search } = useSearchContext();
  const debouncedSearch = useDebounce(search, 250);
  const player = useSoundPlayer();

  const {
    data: sounds,
    isPending,
    isError,
    error,
  } = useQuery(services.sound.query.getSounds);

  if (isPending) return <SoundListPending />;
  if (isError) return <SoundListError error={error.message} />;

  const filteredSounds = sounds?.filter((sound) =>
    sound.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  if (!filteredSounds || filteredSounds.length === 0) return <SoundListEmpty />;

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {filteredSounds.map((sound) => (
        <SoundListItem
          key={sound.id}
          id={sound.id}
          name={sound.name}
          fileName={sound.file_name}
          isCurrent={player.playingId === sound.id}
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          duration={player.duration}
          isLoading={player.isLoading && player.playingId === sound.id}
          onPlay={() => player.play(sound.id, sound.file_name)}
          onPause={player.pause}
          onSeek={player.seek}
        />
      ))}
    </div>
  );
};

const SoundListItem = ({
  id,
  name,
  fileName,
  isCurrent,
  isPlaying,
  currentTime,
  duration,
  isLoading,
  onPlay,
  onPause,
  onSeek,
}: {
  id: number;
  name: string;
  fileName: string;
  isCurrent: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
}) => {
  return (
    <Card
      className={cn(
        "group transition-all",
        isCurrent && "border-primary/50 bg-primary/5",
      )}
    >
      <CardContent className="relative flex items-center gap-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors",
            isCurrent && "bg-primary text-primary-foreground",
          )}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Music className="size-4" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h1 className="truncate font-semibold">{name}</h1>
            {isCurrent && (
              <span className="text-xs font-medium whitespace-nowrap text-primary tabular-nums">
                {minutesToTime(currentTime)} / {minutesToTime(duration)}
              </span>
            )}
          </div>

          {isCurrent ? (
            <div
              className="flex flex-1 items-center pt-1"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Slider
                min={0}
                max={duration > 0 ? duration : 100}
                value={currentTime}
                onValueChange={(vals) =>
                  vals instanceof Array ? onSeek(vals[0]) : onSeek(vals)
                }
              />
            </div>
          ) : (
            <p className="max-w-[300px] truncate text-xs text-muted-foreground">
              {fileName.split(/[\\/]/).pop()}
            </p>
          )}
        </div>

        <div
          className={cn(
            "items-center gap-3 [&_svg]:size-4!",
            isCurrent
              ? "flex pl-2"
              : "absolute right-0 hidden h-full bg-card mask-[linear-gradient(to_right,transparent,theme(--color-card)_2rem)] pr-4 pl-10 group-hover:flex",
          )}
        >
          <Button
            variant={isCurrent ? "default" : "ghost"}
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (isCurrent && isPlaying) {
                onPause();
              } else {
                onPlay();
              }
            }}
            disabled={isLoading}
            title={isCurrent && isPlaying ? "Pause" : "Preview"}
          >
            {isCurrent && isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="ml-0.5 size-4" />
            )}
          </Button>

          {!isCurrent && (
            <>
              <SoundEditButton
                id={id}
                initialName={name}
              />
              <SoundDeleteButton
                id={id}
                fileName={fileName}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const useSoundPlayer = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const cleanup = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isPlaying && playingId !== null) {
      // If paused for 3 seconds, reset the state
      timeout = setTimeout(() => {
        setPlayingId(null);
        cleanup();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, playingId]);

  const play = async (id: number, filePath: string) => {
    if (playingId === id) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    cleanup();

    setIsLoading(true);
    setPlayingId(id);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    try {
      const bytes = await invoke<number[]>("read_sound_file", { filePath });

      const extension = filePath.split(".").pop()?.toLowerCase();
      let mimeType = "audio/mpeg"; // Default fallback

      switch (extension) {
        case "mp3":
          mimeType = "audio/mpeg";
          break;
        case "wav":
          mimeType = "audio/wav";
          break;
        case "ogg":
          mimeType = "audio/ogg";
          break;
        case "m4a":
          mimeType = "audio/mp4";
          break;
        case "aac":
          mimeType = "audio/aac";
          break;
      }

      const blob = new Blob([new Uint8Array(bytes)], { type: mimeType });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setIsLoading(false);
        audio.play().catch((e) => console.error("Play error", e));
        setIsPlaying(true);
      });

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setPlayingId(null);
        cleanup();
      });

      audio.addEventListener("pause", () => {
        setIsPlaying(false);
      });

      audio.addEventListener("play", () => {
        setIsPlaying(true);
      });
    } catch (error) {
      console.error("Failed to load sound:", error);
      setIsLoading(false);
      setPlayingId(null);
      cleanup();
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return {
    playingId,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    play,
    pause,
    seek,
  };
};

const SoundEditButton = ({
  id,
  initialName,
}: {
  id: number;
  initialName: string;
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(initialName);
  const [open, setOpen] = useState(false);

  const updateSound = useMutation({
    ...services.sound.mutation.updateSound,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sounds"] });
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title="Edit Name"
          />
        }
      >
        <Edit />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sound Name</DialogTitle>
          <DialogDescription>
            Sound names are used to identify saved custom sounds.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <div className="grid gap-2">
            <Label htmlFor={`name-${id}`}>Display Name</Label>
            <Input
              id={`name-${id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </DialogPanel>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateSound.mutate({
                id,
                name,
              });
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SoundDeleteButton = ({
  id,
  fileName,
}: {
  id: number;
  fileName: string;
}) => {
  const queryClient = useQueryClient();
  const deleteSound = useMutation({
    ...services.sound.mutation.deleteSound,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sounds"] });
    },
  });

  const handleDelete = async () => {
    deleteSound.mutate(id);
    try {
      await invoke("delete_sound_file", { filePath: fileName });
    } catch (e) {
      console.error("Failed to delete file:", e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="destructive-outline"
            size="icon"
          />
        }
      >
        <Trash />
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete this sound. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose
            render={
              <Button
                onClick={handleDelete}
                variant="destructive"
              />
            }
          >
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};

const SoundListPending = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [skeletonCount] = useState(() => Math.floor(Math.random() * 4) + 3);
  return (
    <div
      className={cn("flex flex-1 flex-col gap-3", className)}
      {...props}
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-24 w-full rounded-2xl"
        />
      ))}
    </div>
  );
};

const SoundListError = ({
  className,
  error,
  ...props
}: React.ComponentProps<"div"> & { error: string }) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 px-8",
        className,
      )}
      {...props}
    >
      <WarningIllustration className="size-40" />
      <div className="flex max-w-[60ch] flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold">Oops! Something went wrong</h1>
        <h3 className="text-balance text-muted-foreground">{error}</h3>
      </div>
    </div>
  );
};

const SoundListEmpty = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 px-8",
        className,
      )}
      {...props}
    >
      <NoDataIllustration className="size-40" />
      <div className="flex max-w-[60ch] flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold">No Sounds Found</h1>
        <h3 className="text-balance text-muted-foreground">
          Upload your custom sounds to use them in schedules.
        </h3>
      </div>
    </div>
  );
};
