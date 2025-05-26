import React, { useEffect } from 'react';
import { useSilkStore } from '@/stores/useSilkStore';
import { toast } from '@/hooks/use-toast';

const SilkPage: React.FC = () => {
  const { walls, fetch, apply, remove } = useSilkStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleApply = async (id: string) => {
    await apply(id);
    toast({ description: 'fond appliqu\u00e9 \u2714' });
  };

  const handleRemove = async (id: string) => {
    await remove(id);
    toast({ description: 'fond supprim\u00e9' });
  };

  if (walls.length === 0) {
    return <div>Cr\u00e9e ton 1er fond soyeux !</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Mes fonds soyeux</h1>
      <div className="grid grid-cols-3 gap-4">
        {walls.map((wall) => (
          <div key={wall.id} className="space-y-2" aria-label="wallpaper">
            <video
              src={wall.mp4Url}
              autoPlay
              loop
              muted
              className="rounded-md w-full h-auto"
            />
            <div className="flex gap-2">
              <button onClick={() => handleApply(wall.id)}>Appliquer</button>
              <button onClick={() => handleRemove(wall.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SilkPage;
