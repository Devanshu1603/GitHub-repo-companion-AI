import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { X, Trash2 } from 'lucide-react';
import { ChatSettings } from '../types';

interface SettingsPanelProps {
  settings: ChatSettings;
  onSave: (settings: ChatSettings) => void;
  onClose: () => void;
  onClearChat: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSave,
  onClose,
  onClearChat,
}) => {
  const [formState, setFormState] = useState<ChatSettings>({ ...settings });
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSave = () => {
    onSave(formState);
  };

  const handleClearChat = () => {
    if (confirmClear) {
      onClearChat();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      // Reset the confirmation after 3 seconds
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Repository Indexing</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="files-to-index" className="text-sm text-gray-500">
                Maximum files to index
              </label>
              <Input
                id="files-to-index"
                type="number"
                min="10"
                max="500"
                value={formState.filesToIndex}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    filesToIndex: parseInt(e.target.value) || 100,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Display Options</h4>
          <div className="flex items-center justify-between">
            <label htmlFor="show-metadata" className="text-sm text-gray-500">
              Show repository metadata
            </label>
            <Switch
              id="show-metadata"
              checked={formState.showMetadata}
              onCheckedChange={(checked) =>
                setFormState({
                  ...formState,
                  showMetadata: checked,
                })
              }
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium mb-2">Session</h4>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleClearChat}
          >
            <Trash2 size={16} className="mr-2" />
            {confirmClear ? 'Are you sure?' : 'Clear chat history'}
          </Button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button className="w-full" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;