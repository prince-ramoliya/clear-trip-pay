import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DbTripMember } from "@/types/database";
import { Plus, Trash2, Pencil, Check, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: DbTripMember[];
  currentUserId: string | undefined;
  tripCreatedBy: string | null;
  onAddMember: (name: string) => Promise<any>;
  onRemoveMember: (memberId: string) => Promise<boolean>;
  onUpdateMemberName: (memberId: string, newName: string) => Promise<boolean>;
}

export function MembersDialog({
  open,
  onOpenChange,
  members,
  currentUserId,
  tripCreatedBy,
  onAddMember,
  onRemoveMember,
  onUpdateMemberName,
}: MembersDialogProps) {
  const [newMemberName, setNewMemberName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);

  const isAdmin = currentUserId === tripCreatedBy;

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;
    
    setIsAdding(true);
    await onAddMember(newMemberName.trim());
    setNewMemberName("");
    setIsAdding(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    setLoadingMemberId(memberId);
    await onRemoveMember(memberId);
    setLoadingMemberId(null);
  };

  const handleStartEdit = (member: DbTripMember) => {
    setEditingMemberId(member.id);
    setEditingName(member.display_name);
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditingName("");
  };

  const handleSaveEdit = async (memberId: string) => {
    if (!editingName.trim()) return;
    
    setLoadingMemberId(memberId);
    await onUpdateMemberName(memberId, editingName.trim());
    setEditingMemberId(null);
    setEditingName("");
    setLoadingMemberId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Trip Members
          </DialogTitle>
          <DialogDescription className="text-base">
            {isAdmin 
              ? "Manage trip participants"
              : `${members.length} member${members.length !== 1 ? 's' : ''}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          <div className="space-y-2">
            {members.map((member) => {
              const isSelf = member.user_id === currentUserId;
              const isCreator = member.user_id === tripCreatedBy;
              const isEditing = editingMemberId === member.id;
              const isLoading = loadingMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-colors",
                    isEditing && "bg-accent"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-base sm:text-lg font-semibold shrink-0",
                    member.is_registered ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {member.display_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-10 text-base"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(member.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                    ) : (
                      <>
                        <p className="text-base font-medium text-foreground truncate">
                          {member.display_name}
                          {isSelf && <span className="text-sm text-muted-foreground ml-1">(You)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isCreator ? "Admin" : member.is_registered ? "Registered" : "Guest"}
                        </p>
                      </>
                    )}
                  </div>

                  {isAdmin && !isCreator && (
                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleSaveEdit(member.id)}
                            disabled={isLoading}
                          >
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleStartEdit(member)}
                            disabled={isLoading}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!isSelf && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {isAdmin && (
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Add member name..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                disabled={isAdding}
                className="h-12 text-base"
              />
              <Button 
                onClick={handleAddMember} 
                disabled={!newMemberName.trim() || isAdding}
                className="h-12 px-4"
              >
                <Plus className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
