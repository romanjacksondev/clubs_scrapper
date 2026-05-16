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

interface Club {
  id: number;
  name: string;
  leagueId: number;
  officialSiteUrl: string;
  officialStoreUrl: string;
  league: League;
}

const emptyForm = () => ({
  name: '',
  leagueId: '',
  officialSiteUrl: '',
  officialStoreUrl: '',
});

export default function ClubsManager() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm());
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterLeague, setFilterLeague] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/clubs').then((r) => {
        if (!r.ok) throw new Error('Failed to load clubs');
        return r.json();
      }),
      fetch('/api/leagues').then((r) => {
        if (!r.ok) throw new Error('Failed to load leagues');
        return r.json();
      }),
    ])
      .then(([clubData, leagueData]) => {
        if (!cancelled) {
          setClubs(clubData);
          setLeagues(leagueData);
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
    const [clubData, leagueData] = await Promise.all([
      fetch('/api/clubs').then((r) => {
        if (!r.ok) throw new Error('Failed to load clubs');
        return r.json();
      }),
      fetch('/api/leagues').then((r) => {
        if (!r.ok) throw new Error('Failed to load leagues');
        return r.json();
      }),
    ]);
    setClubs(clubData);
    setLeagues(leagueData);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError('');
    const res = await fetch('/api/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(emptyForm());
      await load();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Error adding club');
    }
    setAdding(false);
  }

  function startEdit(club: Club) {
    setEditId(club.id);
    setEditForm({
      name: club.name,
      leagueId: String(club.leagueId),
      officialSiteUrl: club.officialSiteUrl,
      officialStoreUrl: club.officialStoreUrl,
    });
    setError('');
  }

  function cancelEdit() {
    setEditId(null);
    setEditForm(emptyForm());
  }

  async function handleSave(id: number) {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/clubs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
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
    if (!confirm(`Delete "${name}"? This will also delete all its products.`)) return;
    setError('');
    const res = await fetch(`/api/clubs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await load();
    } else {
      setError('Error deleting club');
    }
  }

  const displayedClubs = filterLeague
    ? clubs.filter((c) => String(c.leagueId) === filterLeague)
    : clubs;

  const selectClass =
    'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full';

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Club</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="club-name" className="mb-1 block dark:text-gray-300">
              Name
            </Label>
            <TextInput
              id="club-name"
              placeholder="Club name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="club-league" className="mb-1 block dark:text-gray-300">
              League
            </Label>
            <select
              id="club-league"
              value={form.leagueId}
              onChange={(e) => setForm({ ...form, leagueId: e.target.value })}
              required
              className={selectClass}
            >
              <option value="">-- Select league --</option>
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="club-site" className="mb-1 block dark:text-gray-300">
              Official Site URL
            </Label>
            <TextInput
              id="club-site"
              placeholder="https://..."
              value={form.officialSiteUrl}
              onChange={(e) => setForm({ ...form, officialSiteUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="club-store" className="mb-1 block dark:text-gray-300">
              Official Store URL
            </Label>
            <TextInput
              id="club-store"
              placeholder="https://..."
              value={form.officialStoreUrl}
              onChange={(e) => setForm({ ...form, officialStoreUrl: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={adding}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              {adding ? 'Adding...' : 'Add Club'}
            </Button>
          </div>
        </form>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Label className="dark:text-gray-300 whitespace-nowrap">Filter by league:</Label>
        <select
          value={filterLeague}
          onChange={(e) => setFilterLeague(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm"
        >
          <option value="">All leagues</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading clubs...</p>
        ) : (
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>League</TableHeadCell>
                <TableHeadCell>Site</TableHeadCell>
                <TableHeadCell>Store</TableHeadCell>
                <TableHeadCell className="text-right">Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {displayedClubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                    No clubs found.
                  </TableCell>
                </TableRow>
              ) : (
                displayedClubs.map((club) =>
                  editId === club.id ? (
                    <TableRow key={club.id} className="bg-white dark:bg-gray-800">
                      <TableCell>
                        <TextInput
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          sizing="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={editForm.leagueId}
                          onChange={(e) => setEditForm({ ...editForm, leagueId: e.target.value })}
                          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 text-sm"
                        >
                          {leagues.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <TextInput
                          value={editForm.officialSiteUrl}
                          onChange={(e) =>
                            setEditForm({ ...editForm, officialSiteUrl: e.target.value })
                          }
                          sizing="sm"
                          placeholder="https://..."
                        />
                      </TableCell>
                      <TableCell>
                        <TextInput
                          value={editForm.officialStoreUrl}
                          onChange={(e) =>
                            setEditForm({ ...editForm, officialStoreUrl: e.target.value })
                          }
                          sizing="sm"
                          placeholder="https://..."
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="xs"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() => handleSave(club.id)}
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
                      key={club.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {club.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {club.league.name}
                      </TableCell>
                      <TableCell>
                        {club.officialSiteUrl ? (
                          <a
                            href={club.officialSiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            Site
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {club.officialStoreUrl ? (
                          <a
                            href={club.officialStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            Store
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="xs" color="light" onClick={() => startEdit(club)}>
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => handleDelete(club.id, club.name)}
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
