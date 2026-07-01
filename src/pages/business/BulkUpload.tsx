import { useState } from 'react';
import { Upload, FileText, CheckCircle2, X, AlertTriangle, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SAMPLE_CSV = `sender_name,sender_phone,sender_city,receiver_name,receiver_phone,receiver_city,type,weight,description
Ahmad Hassan,+9647501234567,Sulaymaniyah,Sara Mohammed,+9647709876543,Sulaymaniyah,standard,2.5,Books and documents
KurdShop LLC,+9647702345678,Sulaymaniyah,RetailKRD Store,+9647503334444,Sulaymaniyah,bulk,18.5,Retail goods
TechKRD Solutions,+9647505678901,Sulaymaniyah,MedTech Duhok,+9647802223333,Duhok,express,3.0,IT equipment`;

interface ParsedRow {
  sender_name: string; sender_phone: string; sender_city: string;
  receiver_name: string; receiver_phone: string; receiver_city: string;
  type: string; weight: string; description: string;
  _valid: boolean; _error?: string;
}

export default function BulkUpload() {
  const [dragging, setDragging] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i] || ''; });
      const valid = !!row.sender_name && !!row.receiver_name && !!row.receiver_city && parseFloat(row.weight) > 0;
      return { ...row, _valid: valid, _error: valid ? undefined : 'Missing required fields' } as ParsedRow;
    });
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => { setRows(parseCSV(e.target?.result as string)); };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleProcess = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setUploaded(true);
    setProcessing(false);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kurdpost_bulk_sample.csv';
    a.click();
  };

  const validRows = rows.filter(r => r._valid);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bulk Shipment Upload</h1>
          <p className="text-slate-500 text-sm">Upload a CSV file to create multiple shipments at once</p>
        </div>
        <Button variant="outline" icon={<Download size={14} />} onClick={downloadSample}>Download Sample CSV</Button>
      </div>

      {uploaded ? (
        <Card>
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">{validRows.length} Shipments Created!</h2>
            <p className="text-slate-500 text-sm mb-6">Your bulk shipments have been registered. Tracking numbers have been assigned to all valid entries.</p>
            <Button onClick={() => { setRows([]); setUploaded(false); }}>Upload Another File</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white'
            }`}
          >
            <Upload size={36} className={`mx-auto mb-3 ${dragging ? 'text-blue-500' : 'text-slate-400'}`} />
            <p className="font-semibold text-slate-700 mb-1">Drag & drop your CSV file here</p>
            <p className="text-sm text-slate-400 mb-4">or</p>
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={handleInputChange} />
              <span className="px-5 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">Browse Files</span>
            </label>
            <p className="text-xs text-slate-400 mt-4">Supported format: CSV · Max 500 rows per upload</p>
          </div>

          {/* CSV format guide */}
          <Card>
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><FileText size={16} /> Required CSV Columns</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['sender_name', 'sender_phone', 'sender_city', 'receiver_name', 'receiver_phone', 'receiver_city', 'type', 'weight', 'description'].map(col => (
                <code key={col} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">{col}</code>
              ))}
            </div>
          </Card>

          {/* Preview */}
          {rows.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-800">Preview — {rows.length} rows parsed</h3>
                  <p className="text-sm text-slate-400">{validRows.length} valid · {rows.length - validRows.length} invalid</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" icon={<X size={14} />} onClick={() => setRows([])}>Clear</Button>
                  {validRows.length > 0 && (
                    <Button size="sm" loading={processing} onClick={handleProcess} icon={<Upload size={14} />}>
                      Process {validRows.length} Shipments
                    </Button>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Status', 'Sender', 'Receiver', 'City', 'Type', 'Weight', 'Description'].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-slate-500 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.slice(0, 10).map((row, i) => (
                      <tr key={i} className={row._valid ? '' : 'bg-red-50'}>
                        <td className="px-4 py-2">
                          {row._valid
                            ? <CheckCircle2 size={14} className="text-emerald-500" />
                            : <span className="flex items-center gap-1 text-red-600"><AlertTriangle size={12} /> {row._error}</span>
                          }
                        </td>
                        <td className="px-4 py-2 text-slate-700">{row.sender_name}</td>
                        <td className="px-4 py-2 text-slate-700">{row.receiver_name}</td>
                        <td className="px-4 py-2 text-slate-500">{row.receiver_city}</td>
                        <td className="px-4 py-2 text-slate-500 capitalize">{row.type}</td>
                        <td className="px-4 py-2 text-slate-500">{row.weight} kg</td>
                        <td className="px-4 py-2 text-slate-500 truncate max-w-xs">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 10 && <p className="px-4 py-2 text-xs text-slate-400">...and {rows.length - 10} more rows</p>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
