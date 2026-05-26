import{j as e,bl as r,a4 as p,V as j,bm as i,aj as c,b6 as n,n as E,bb as h,bn as C,ai as N}from"./react-vendor-DiAjsH57.js";import{A as f,B as t}from"./index-BFcwGMfJ.js";import{C as d,a as m,b as x,c as u}from"./card-rM-UCwwf.js";import{a4 as y}from"./vendor-IU1H5IcB.js";import{m as l}from"./animation-vendor-BFhYcS4y.js";import"./ui-vendor-BQCqNqg0.js";function D(){const o=(s,a)=>{navigator.clipboard.writeText(s),y.success(`${a} copied to clipboard!`)},b=[{title:"All Contact Forms",icon:c,sql:`SELECT 
  key,
  value->>'name' as name,
  value->>'email' as email,
  value->>'service' as service,
  value->>'status' as status,
  value->>'created_at' as submitted_at
FROM kv_store_feacf0d8 
WHERE key LIKE 'contact_%' 
ORDER BY created_at DESC;`},{title:"All Collaboration Requests",icon:c,sql:`SELECT 
  key,
  value->>'name' as name,
  value->>'email' as email,
  value->>'organization' as organization,
  value->>'collaborationType' as type,
  value->>'status' as status
FROM kv_store_feacf0d8 
WHERE key LIKE 'collaboration_%' 
ORDER BY created_at DESC;`},{title:"All Shop Orders",icon:n,sql:`SELECT 
  key,
  value->'customer_info'->>'name' as customer,
  value->'customer_info'->>'email' as email,
  value->>'amount' as amount,
  value->>'status' as status,
  value->>'created_at' as order_date
FROM kv_store_feacf0d8 
WHERE key LIKE 'order_%' 
ORDER BY created_at DESC;`},{title:"All Event Tickets",icon:n,sql:`SELECT 
  key,
  value->>'ticket_code' as ticket_code,
  value->'customer_info'->>'name' as customer,
  value->>'quantity' as quantity,
  value->>'total_amount' as amount,
  value->>'status' as status
FROM kv_store_feacf0d8 
WHERE key LIKE 'ticket_%' 
ORDER BY created_at DESC;`},{title:"All Memberships",icon:E,sql:`SELECT 
  key,
  value->>'member_number' as member_number,
  value->>'membership_type' as type,
  value->'customer_info'->>'name' as member_name,
  value->'customer_info'->>'email' as email,
  value->>'status' as status,
  value->>'expires_at' as expires
FROM kv_store_feacf0d8 
WHERE key LIKE 'membership_%' 
ORDER BY created_at DESC;`},{title:"Revenue Summary",icon:n,sql:`SELECT 
  CASE 
    WHEN key LIKE 'order_%' THEN 'Shop Orders'
    WHEN key LIKE 'ticket_%' THEN 'Event Tickets'
    WHEN key LIKE 'booking_%' THEN 'Bookings'
    WHEN key LIKE 'rental_%' THEN 'Rentals'
  END as source,
  COUNT(*) as transactions,
  SUM(CAST(value->>'amount' AS DECIMAL)) as total
FROM kv_store_feacf0d8
WHERE key LIKE 'order_%' 
   OR key LIKE 'ticket_%' 
   OR key LIKE 'booking_%'
   OR key LIKE 'rental_%'
GROUP BY source
ORDER BY total DESC;`},{title:"Last 7 Days Activity",icon:h,sql:`SELECT * FROM kv_store_feacf0d8
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;`},{title:"Search by Email",icon:h,sql:`SELECT * FROM kv_store_feacf0d8
WHERE value::text LIKE '%customer@email.com%';
-- Replace with actual email`}],v=[{prefix:"contact_",type:"Contact Forms",color:"#A68F59"},{prefix:"collaboration_",type:"Collaboration Requests",color:"#B1643B"},{prefix:"order_",type:"Shop Orders",color:"#A68F59"},{prefix:"ticket_",type:"Event Tickets",color:"#B1643B"},{prefix:"membership_",type:"Memberships",color:"#A68F59"},{prefix:"rental_",type:"Equipment Rentals",color:"#B1643B"},{prefix:"digital_",type:"Digital Products",color:"#A68F59"},{prefix:"notification_",type:"Email Signups",color:"#B1643B"},{prefix:"booking_",type:"Service Bookings",color:"#A68F59"},{prefix:"preorder_",type:"Pre-orders",color:"#B1643B"}];return e.jsx(f,{children:e.jsxs("div",{className:"min-h-screen",style:{backgroundColor:"#F5F1EB"},children:[e.jsx("div",{className:"border-b",style:{backgroundColor:"#FFFFFF",borderColor:"#E3DCD3"},children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-16 h-16 rounded-2xl flex items-center justify-center",style:{backgroundColor:"rgba(166, 143, 89, 0.1)"},children:e.jsx(r,{className:"w-8 h-8",style:{color:"#A68F59"}})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl mb-1",style:{color:"#121212"},children:"Supabase Database Access"}),e.jsx("p",{style:{color:"#7A6F66"},children:"Direct access to your CREOVA data"})]})]}),e.jsxs(t,{onClick:()=>window.open("https://supabase.com/dashboard","_blank"),className:"flex items-center gap-2",style:{backgroundColor:"#121212"},children:["Open Supabase Dashboard",e.jsx(p,{className:"w-4 h-4"})]})]})})}),e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[e.jsx(l.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"mb-12",children:e.jsxs(d,{style:{backgroundColor:"#FFFFFF",borderColor:"#E3DCD3"},children:[e.jsx(m,{children:e.jsxs(x,{className:"flex items-center gap-2",children:[e.jsx(j,{className:"w-5 h-5",style:{color:"#A68F59"}}),"Quick Access"]})}),e.jsxs(u,{className:"space-y-4",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"p-4 rounded-xl",style:{backgroundColor:"#F5F1EB"},children:[e.jsx("div",{className:"text-sm mb-2",style:{color:"#7A6F66"},children:"Database Table"}),e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsx("code",{className:"text-lg",style:{color:"#121212"},children:"kv_store_feacf0d8"}),e.jsx(t,{size:"sm",variant:"outline",onClick:()=>o("kv_store_feacf0d8","Table name"),children:e.jsx(i,{className:"w-4 h-4"})})]})]}),e.jsxs("div",{className:"p-4 rounded-xl",style:{backgroundColor:"#F5F1EB"},children:[e.jsx("div",{className:"text-sm mb-2",style:{color:"#7A6F66"},children:"Dashboard URL"}),e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsx("div",{className:"text-sm",style:{color:"#121212"},children:"supabase.com/dashboard"}),e.jsx(t,{size:"sm",variant:"outline",onClick:()=>window.open("https://supabase.com/dashboard","_blank"),children:e.jsx(p,{className:"w-4 h-4"})})]})]})]}),e.jsx("div",{className:"p-4 rounded-xl border-l-4",style:{backgroundColor:"rgba(166, 143, 89, 0.1)",borderColor:"#A68F59"},children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(r,{className:"w-5 h-5 mt-0.5",style:{color:"#A68F59"}}),e.jsxs("div",{children:[e.jsx("div",{className:"mb-1",style:{color:"#121212"},children:"How to Access:"}),e.jsxs("ol",{className:"text-sm space-y-1 list-decimal list-inside",style:{color:"#7A6F66"},children:[e.jsx("li",{children:"Go to supabase.com/dashboard"}),e.jsx("li",{children:"Login to your account"}),e.jsx("li",{children:"Select your CREOVA project"}),e.jsx("li",{children:'Click "Table Editor" in left sidebar'}),e.jsx("li",{children:'Open "kv_store_feacf0d8" table'})]})]})]})})]})]})}),e.jsxs(l.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.1},className:"mb-12",children:[e.jsx("h2",{className:"text-2xl mb-6",style:{color:"#121212"},children:"Data Types in Your Database"}),e.jsx("div",{className:"grid md:grid-cols-2 lg:grid-cols-3 gap-4",children:v.map((s,a)=>e.jsxs(l.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{delay:a*.05},className:"p-4 rounded-xl border-l-4 cursor-pointer hover:shadow-md transition-shadow",style:{backgroundColor:"#FFFFFF",borderColor:s.color},onClick:()=>o(s.prefix,"Key prefix"),children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm mb-1",style:{color:"#7A6F66"},children:"Key Prefix"}),e.jsx("code",{className:"text-sm",style:{color:s.color},children:s.prefix})]}),e.jsx(i,{className:"w-4 h-4",style:{color:"#7A6F66"}})]}),e.jsx("div",{className:"mt-2",style:{color:"#121212"},children:s.type})]},a))})]}),e.jsxs(l.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx("h2",{className:"text-2xl mb-6",style:{color:"#121212"},children:"Ready-to-Use SQL Queries"}),e.jsx("div",{className:"grid gap-6",children:b.map((s,a)=>e.jsx(l.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:a*.05},children:e.jsxs(d,{style:{backgroundColor:"#FFFFFF",borderColor:"#E3DCD3"},children:[e.jsx(m,{children:e.jsxs(x,{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s.icon,{className:"w-5 h-5",style:{color:"#A68F59"}}),s.title]}),e.jsxs(t,{size:"sm",onClick:()=>o(s.sql,"Query"),style:{backgroundColor:"#121212"},children:[e.jsx(i,{className:"w-4 h-4 mr-2"}),"Copy Query"]})]})}),e.jsx(u,{children:e.jsx("div",{className:"p-4 rounded-lg overflow-x-auto",style:{backgroundColor:"#1e1e1e"},children:e.jsx("pre",{className:"text-sm",style:{color:"#d4d4d4"},children:e.jsx("code",{children:s.sql})})})})]})},a))})]}),e.jsx(l.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},className:"mt-12",children:e.jsxs(d,{style:{backgroundColor:"#FFFFFF",borderColor:"#E3DCD3"},children:[e.jsx(m,{children:e.jsxs(x,{className:"flex items-center gap-2",children:[e.jsx(c,{className:"w-5 h-5",style:{color:"#A68F59"}}),"Additional Resources"]})}),e.jsx(u,{children:e.jsxs("div",{className:"grid md:grid-cols-3 gap-4",children:[e.jsxs("a",{href:"https://supabase.com/docs",target:"_blank",rel:"noopener noreferrer",className:"p-4 rounded-xl border-2 hover:shadow-md transition-all",style:{borderColor:"#E3DCD3"},children:[e.jsx(C,{className:"w-6 h-6 mb-2",style:{color:"#A68F59"}}),e.jsx("div",{className:"mb-1",style:{color:"#121212"},children:"Supabase Docs"}),e.jsx("div",{className:"text-sm",style:{color:"#7A6F66"},children:"Complete documentation"})]}),e.jsxs("a",{href:"https://supabase.com/docs/guides/database/overview",target:"_blank",rel:"noopener noreferrer",className:"p-4 rounded-xl border-2 hover:shadow-md transition-all",style:{borderColor:"#E3DCD3"},children:[e.jsx(r,{className:"w-6 h-6 mb-2",style:{color:"#B1643B"}}),e.jsx("div",{className:"mb-1",style:{color:"#121212"},children:"SQL Reference"}),e.jsx("div",{className:"text-sm",style:{color:"#7A6F66"},children:"Learn SQL queries"})]}),e.jsxs("button",{onClick:()=>{window.open("https://supabase.com/docs/guides/database/overview","_blank"),y.success("Opening documentation in new tab")},className:"p-4 rounded-xl border-2 hover:shadow-md transition-all text-left",style:{borderColor:"#E3DCD3"},children:[e.jsx(N,{className:"w-6 h-6 mb-2",style:{color:"#A68F59"}}),e.jsx("div",{className:"mb-1",style:{color:"#121212"},children:"Full Guide"}),e.jsx("div",{className:"text-sm",style:{color:"#7A6F66"},children:"View complete documentation"})]})]})})]})})]})]})})}export{D as DatabaseAccessPage};
