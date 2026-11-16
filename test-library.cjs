const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),D=require('./public/training-data.js');
test('pendências incluem todas as alternativas do catálogo e arquivos associados existem',()=>{const ctx={window:{}};vm.runInNewContext(fs.readFileSync('public/library.js','utf8'),ctx);const library=ctx.window.RITMO_VIDEO_LIBRARY,available=new Set([...Object.keys(library),'Supino com barra']),sources=JSON.parse(fs.readFileSync('public/media/fontes.json','utf8'));assert.deepEqual(sources.pending,D.CATALOG.filter(e=>!available.has(e.name)).map(e=>e.name));assert.equal(available.size,26);for(const row of Object.values(library)){assert(fs.existsSync('public/media/'+row.file));if(row.poster)assert(fs.existsSync('public/media/'+row.poster))}const curl=library['Rosca com halteres'];assert.equal(curl.variant,'Rosca com halteres em banco inclinado');assert.equal(curl.author,'YouCan (@joinyoucan)');assert.equal(curl.editedWith,'FFmpeg 9.0.2');assert.match(D.info('Rosca com halteres').cue,/banco inclinado/);const bytes=fs.readFileSync('public/media/'+curl.file);assert.equal(bytes.toString('ascii',4,8),'ftyp');const row=sources.clips.find(r=>r.file==='public/media/'+curl.file);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),row.sha256);assert.equal(row.audio,false);assert(bytes.indexOf(Buffer.from('moov'))<bytes.indexOf(Buffer.from('mdat')))});
test('remada da biblioteca preserva a procedência alternativa e a integridade do MP4',()=>{
 const ctx={window:{}};
 vm.runInNewContext(fs.readFileSync('public/library.js','utf8'),ctx);
 const mapping=ctx.window.RITMO_VIDEO_LIBRARY['Remada na máquina'];
 const sources=JSON.parse(fs.readFileSync('public/media/fontes.json','utf8'));
 const clip=sources.clips.find(row=>row.name==='Remada na máquina');
 assert.equal(mapping.author,'YouCan Workout Library');
 assert.equal(mapping.sourceLabel,'Ver na biblioteca de origem');
 assert.equal(mapping.source,clip.source);
 assert.match(mapping.note,/vínculo oficial.*não confirmado/);
 assert.equal(clip.officialRelationshipConfirmed,false);
 assert.equal(clip.originalTikTokPost,null);
 assert.equal(clip.audio,false);
 assert.equal(clip.codec,'h264');
 assert.equal(clip.pixelFormat,'yuv420p');
 assert.equal(clip.frameRate,'30/1');
 const bytes=fs.readFileSync('public/media/'+mapping.file);
 assert.equal(bytes.toString('ascii',4,8),'ftyp');
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 assert(bytes.indexOf(Buffer.from('moov'))<bytes.indexOf(Buffer.from('mdat')));
});
test('dez novos vídeos mantêm associação, fonte alternativa e integridade da mídia',()=>{
 const ctx={window:{}};
 vm.runInNewContext(fs.readFileSync('public/library.js','utf8'),ctx);
 const library=ctx.window.RITMO_VIDEO_LIBRARY,sources=JSON.parse(fs.readFileSync('public/media/fontes.json','utf8'));
 const expected={
  'Supino na máquina':'42b8aafa-caa8-4572-8b35-46234c274ce3',
  'Supino inclinado na máquina':'d93acb5f-8546-4e9d-a81c-a6fd67bdf78d',
  'Crucifixo na máquina':'883396ed-584a-4e01-9f85-2f533a1351a6',
  'Crossover':'236052d3-86b2-4e4f-af71-ec030a9eac6d',
  'Remada no Smith':'fad94a72-844d-400e-8784-6008f0749da1',
  'Rosca Scott na máquina':'c0e3300a-143e-47c1-96d8-56f9844baf56',
  'Abdominal na máquina':'33bdbe17-8ec1-41b8-afa1-9cc290c3724f',
  'Elevação de pernas':'bed06906-bd3f-4614-95c3-0ab772c93fdb',
  'Rosca na polia':'social-22','Tríceps corda':'social-82'
 };
 assert.equal(sources.latestLibrarySearch.pendingNew.length,17);
 for(const [name,sourceId]of Object.entries(expected)){
  const mapping=library[name],clip=sources.clips.find(r=>r.name===name);
  assert(mapping,name);assert.equal(clip.sourceId,sourceId);assert.equal(clip.file,'public/media/'+mapping.file);
  assert.equal(mapping.source,clip.source);assert.equal(mapping.author,'YouCan Workout Library');
  assert.equal(clip.officialRelationshipConfirmed,false);assert.equal(clip.originalTikTokPost,null);
  assert.equal(mapping.sourceLabel,'Ver na biblioteca de origem');assert.equal(clip.audio,false);
  assert.equal(clip.codec,'h264');assert.equal(clip.pixelFormat,'yuv420p');assert.equal(clip.frameRate,'30/1');
  assert(clip.width<=720&&clip.height<=1280);assert(clip.duration>=5);
  const bytes=fs.readFileSync(clip.file);assert.equal(bytes.toString('ascii',4,8),'ftyp');
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256);
  assert(bytes.indexOf(Buffer.from('moov'))<bytes.indexOf(Buffer.from('mdat')));
  const poster=fs.readFileSync(clip.poster);assert.equal(poster.readUInt16BE(0),0xffd8);
 }
 assert(!library['Rosca bíceps na máquina'],'O Scott não deve ser apresentado como outro modelo de máquina');
 assert(!library['Extensão lombar'],'Banco livre não corresponde à máquina cadastrada');
 assert(!library['Puxada articulada'],'Polia não corresponde à máquina articulada');
 const rope=sources.clips.find(r=>r.name==='Tríceps corda');assert.equal(rope.start,13.5);assert.equal(rope.end,24.8);
});
