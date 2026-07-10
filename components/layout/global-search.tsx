"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Layers, User } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { globalSearch, type SearchResult } from "@/lib/actions/search";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const searchResults = await globalSearch(query);
        setResults(searchResults);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [query, open, startTransition]);

  function handleSelect(result: SearchResult) {
    setOpen(false);
    setQuery("");
    router.push(result.type === "chain" ? `/chains/${result.id}` : `/members/${result.id}`);
  }

  const chainResults = results.filter((r) => r.type === "chain");
  const memberResults = results.filter((r) => r.type === "member");

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 text-muted-foreground sm:w-56"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Tìm kiếm...</span>
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Tìm dây hụi, thành viên..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {pending ? "Đang tìm..." : "Không tìm thấy kết quả"}
            </CommandEmpty>
            {chainResults.length ? (
              <CommandGroup heading="Dây hụi">
                {chainResults.map((result) => (
                  <CommandItem
                    key={`chain-${result.id}`}
                    value={`chain-${result.id}`}
                    onSelect={() => handleSelect(result)}
                  >
                    <Layers /> {result.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {memberResults.length ? (
              <CommandGroup heading="Thành viên">
                {memberResults.map((result) => (
                  <CommandItem
                    key={`member-${result.id}`}
                    value={`member-${result.id}`}
                    onSelect={() => handleSelect(result)}
                  >
                    <User /> {result.title}
                    {result.subtitle ? ` · ${result.subtitle}` : ""}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
