import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Props = {
  name?: string
  availableChannels?: string[]
}

export const ChannelSelector: React.FC<Props> = ({ name = 'channels', availableChannels = [] }) => {
  const { control, watch, setValue } = useFormContext()
  const channels: string[] = watch(name) || []

  const addChannel = (value: string) => {
    const normalized = value.trim().toLowerCase()
    if (!normalized) return
    if (!channels.includes(normalized)) {
      setValue(name, [...channels, normalized], { shouldValidate: true, shouldDirty: true })
    }
  }

  const removeChannel = (c: string) => {
    setValue(
      name,
      channels.filter((x) => x !== c),
      { shouldValidate: true, shouldDirty: true },
    )
  }

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Add channel and press Enter (e.g. facebook)"
              aria-label="Add a new channel"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addChannel((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
            />
            <div className="flex gap-2" aria-label="Available channels to add">
              {availableChannels.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant="outline"
                  onClick={() => addChannel(c)}
                  aria-label={`Add channel ${c}`}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex gap-2 flex-wrap" aria-label="Selected channels list">
            {channels.map((c) => (
              <Badge key={c} className="flex items-center gap-2">
                <span className="capitalize">{c}</span>
                <button
                  onClick={() => removeChannel(c)}
                  className="ml-2 text-xs"
                  aria-label={`Remove channel ${c}`}
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    />
  )
}
