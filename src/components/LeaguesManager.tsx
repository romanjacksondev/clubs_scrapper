'use client';

import {
  Button,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import type { League } from '../hooks/useLeagues';

export default function LeaguesManager() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/leagues')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load leagues');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setLeagues(data);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function load() {
    const res = await fetch('/api/leagues');
    if (res.ok) setLeagues(await res.json());
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    const res = await fetch('/api/leagues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      setNewName('');
      await load();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Error adding league');
    }
    setAdding(false);
  }

  function startEdit(league: League) {
    setEditId(league.id);
    setEditName(league.name);
    setError('');
  }

  function cancelEdit() {
    setEditId(null);
    setEditName('');
  }

  async function handleSave(id: number) {
    if (!editName.trim()) return;
    setSaving(true);
    setError('');
    const res = await fetch(`/api/leagues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    });
    if (res.ok) {
      cancelEdit();
      await load();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Error saving');
    }
    setSaving(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This will also delete all its clubs.`)) return;
    setError('');
    const res = await fetch(`/api/leagues/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await load();
    } else {
      setError('Error deleting league');
    }
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add League</h2>
        <form onSubmit={handleAdd} className="flex gap-3 items-end">
          <div className="flex-1">
            <Label htmlFor="league-name" className="mb-1 block dark:text-gray-300">
              Name
            </Label>
            <TextInput
              id="league-name"
              placeholder="League name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={adding}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            {adding ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading leagues...</p>
        ) : (
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell className="text-right">Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {leagues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500 py-6">
                    No leagues found.
                  </TableCell>
                </TableRow>
              ) : (
                leagues.map((league) =>
                  editId === league.id ? (
                    <TableRow key={league.id} className="bg-white dark:bg-gray-800">
                      <TableCell>
                        <TextInput
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          sizing="sm"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="xs"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() => handleSave(league.id)}
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button size="xs" color="light" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow
                      key={league.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {league.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="xs" color="light" onClick={() => startEdit(league)}>
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => handleDelete(league.id, league.name)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
