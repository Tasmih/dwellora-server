import { ObjectId } from "mongodb";
import fs from "fs";

interface CategoryDef {
  name: string;
  id: string;
  services: {
    title: string;
    slug: string;
    image: string;
    shortDescription: string;
    description: string;
    includedItems: { title: string; description: string }[];
    seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string;
      ogTitle: string;
      ogDescription: string;
      ogImage: string;
      canonicalUrl: string;
    };
  }[];
}

const categories: CategoryDef[] = [
  {
    name: "Full Home Renovation",
    id: "6ac3fcbe079b63ca2b27b03f",
    services: [
      {
        title: "Complete Home Renovation",
        slug: "complete-home-renovation",
        image: "https://i.ibb.co/k63Kv661/complete-home-renovation.jpg",
        shortDescription:
          "Full-scale residential renovation delivering architectural design, structural upgrades, and turnkey luxury finishes across your entire residence.",
        description:
          "Dwellora’s complete home renovation service reimagines your entire residence through unified architectural planning, structural excellence, and bespoke artisan craftsmanship. Our multidisciplinary team manages the entire renovation lifecycle, beginning with spatial feasibility assessments and 3D architectural visualizations, through to structural reinforcement, modern MEP utility installations, and custom joinery. By centralizing design and general contracting under dedicated project leadership, we eliminate contractor misalignments, minimize timelines, and ensure superior quality control. Homeowners benefit from elevated energy efficiency, expanded open-concept living zones, and bespoke luxury finishes that substantially boost property value while creating a tailored sanctuary built for everyday living.",
        includedItems: [
          {
            title: "Architectural Planning & 3D Visualization",
            description:
              "Comprehensive space planning, structural engineering review, building permits management, and high-resolution 3D interior design renderings.",
          },
          {
            title: "Structural Reconstruction & MEP Modernization",
            description:
              "Safe removal of interior walls, seismic framing upgrades, full electrical rewiring, code-compliant plumbing, and central HVAC optimization.",
          },
          {
            title: "Turnkey Interior Fit-Out & Project Oversight",
            description:
              "Custom architectural millwork, premium flooring installation, fine painting, daily on-site supervision, and dedicated post-completion warranty.",
          },
        ],
        seo: {
          metaTitle: "Complete Home Renovation Services | Dwellora",
          metaDescription:
            "Transform your entire residence with Dwellora's turnkey complete home renovation services. Exceptional architectural design, structural engineering, and luxury finishes.",
          keywords:
            "complete home renovation, whole house remodel, turnkey home renovation, architectural remodeling, luxury residential contractor",
          ogTitle: "Complete Home Renovation | Dwellora Luxury Interiors",
          ogDescription:
            "Experience end-to-end whole home transformation with master craftsmanship, dedicated project management, and bespoke finishes.",
          ogImage: "https://i.ibb.co/k63Kv661/complete-home-renovation.jpg",
          canonicalUrl:
            "https://dwellora.com/services/complete-home-renovation",
        },
      },
      {
        title: "Interior Home Remodeling",
        slug: "interior-home-remodeling",
        image: "https://i.ibb.co/whSqNGYp/Interior-Home-Remodeling.jpg",
        shortDescription:
          "Bespoke interior redesign optimizing floor plan flow, natural lighting, and refined architectural millwork for sophisticated modern living.",
        description:
          "Revitalize the interior character of your home with Dwellora’s specialized interior remodeling service. We transform disjointed, outdated layouts into harmonious living environments characterized by seamless room-to-room flow, optimized natural illumination, and tailored architectural detailing. Our structured process incorporates non-load-bearing partition removal, custom ceiling profiles, designer lighting schemes, and premium trim carpentry. Working with high-grade hardwood veneers, acoustic wall panels, and low-VOC mineral finishes, our craftsmen execute every detail to perfection. Homeowners gain elevated comfort, enhanced everyday utility, and an exquisite aesthetic environment that reflects their individual lifestyle with timeless sophistication.",
        includedItems: [
          {
            title: "Interior Spatial Reconfiguration",
            description:
              "Open-plan layout conversion, partition repositioning, doorway widening, and acoustic sub-wall insulation for improved privacy.",
          },
          {
            title: "Architectural Lighting & Ceiling Design",
            description:
              "Installation of layered ambient lighting, concealed LED cove light troughs, dimmable circuits, and seamless drywall integration.",
          },
          {
            title: "Custom Trim Carpentry & Fine Finishes",
            description:
              "Precision-crafted baseboards, door casings, custom room dividers, shadowline reveals, and multi-coat designer paint applications.",
          },
        ],
        seo: {
          metaTitle: "Interior Home Remodeling Services | Dwellora",
          metaDescription:
            "Elevate your living experience with bespoke interior remodeling by Dwellora. Open-concept space planning, architectural lighting, and premium craftsmanship.",
          keywords:
            "interior home remodeling, residential interior renovation, modern home remodel, open concept living, interior design contractor",
          ogTitle: "Interior Home Remodeling | Dwellora Design & Build",
          ogDescription:
            "Sophisticated interior transformations with open-plan layouts, custom millwork, and refined architectural finishes.",
          ogImage: "https://i.ibb.co/whSqNGYp/Interior-Home-Remodeling.jpg",
          canonicalUrl:
            "https://dwellora.com/services/interior-home-remodeling",
        },
      },
    ],
  },
  {
    name: "Kitchen Renovation",
    id: "6ac40c35079b63ca2b27b040",
    services: [
      {
        title: "Kitchen Cabinet Renovation",
        slug: "kitchen-cabinet-renovation",
        image: "https://i.ibb.co/TDh3k91h/Kitchen-Cabinet-Renovation.jpg",
        shortDescription:
          "Custom-crafted cabinetry with precision Blum hardware, durable solid core construction, and optimized organizational storage systems.",
        description:
          "Elevate your culinary environment with Dwellora’s bespoke kitchen cabinet renovation. We design, manufacture, and install custom cabinetry that combines timeless aesthetics with uncompromising structural integrity. Utilizing premium hardwood framing, moisture-resistant marine-grade plywood cores, and soft-close German hardware, each unit is built for heavy daily use without sagging or misalignment. Our design process tailors internal compartments with spice pull-outs, corner carousels, and concealed waste systems. From laser-guided site mapping to multi-stage factory spray finishing, our master joiners oversee every phase. Enjoy effortless organization, scratch-resistant factory finishes, and a tailored aesthetic that unifies your kitchen’s architecture with functional luxury.",
        includedItems: [
          {
            title: "Custom Cabinetry Design & Fabrication",
            description:
              "Precision milling of solid wood face frames, dovetailed drawer boxes, and shaker or sleek flat-panel doors in custom lacquers.",
          },
          {
            title: "Premium Soft-Close Hardware Integration",
            description:
              "Installation of heavy-duty Blum undermount drawer slides, 110-degree soft-close hinges, and modular internal divider systems.",
          },
          {
            title: "Laser Alignment & Architectural Trim Scribing",
            description:
              "Laser-level mounting on uneven walls, custom crown molding, matching toe kicks, and protective polyurethane sealing.",
          },
        ],
        seo: {
          metaTitle: "Custom Kitchen Cabinet Renovation | Dwellora",
          metaDescription:
            "Upgrade your kitchen with custom handcrafted cabinetry by Dwellora. Moisture-resistant construction, soft-close hardware, and bespoke storage solutions.",
          keywords:
            "kitchen cabinet renovation, custom kitchen cabinets, bespoke cabinetry, soft close kitchen storage, luxury cabinet maker",
          ogTitle: "Kitchen Cabinet Renovation | Dwellora Custom Cabinetry",
          ogDescription:
            "Handcrafted luxury kitchen cabinets featuring dovetail drawers, premium hardware, and bespoke organizational layouts.",
          ogImage: "https://i.ibb.co/TDh3k91h/Kitchen-Cabinet-Renovation.jpg",
          canonicalUrl:
            "https://dwellora.com/services/kitchen-cabinet-renovation",
        },
      },
      {
        title: "Kitchen Counter Renovation",
        slug: "kitchen-counter-renovation",
        image: "https://i.ibb.co/twG36fNG/Kitchen-Counter-Renovation.jpg",
        shortDescription:
          "Precision-fabricated quartz, granite, and porcelain countertops featuring mitered waterfall gables and seamless undermount cutouts.",
        description:
          "Transform your kitchen’s prep surfaces with Dwellora’s luxury countertop renovation service. We curate premier slabs of engineered quartz, natural granite, and sintered porcelain known for exceptional heat, scratch, and stain resistance. Our fabrication process uses high-precision digital laser templating and CNC diamond cutting to achieve seamless mitered waterfall drops, bookmatched veining, and micro-beveled edges. We reinforce all sub-framing to ensure complete load support before applying food-safe antimicrobial sealants. Upgrading your counters enhances hygiene through non-porous surfaces, dramatically elevates kitchen aesthetics, and provides a durable, easy-to-maintain workspace built for gourmet culinary preparation.",
        includedItems: [
          {
            title: "Digital Laser Templating & Slab Selection",
            description:
              "Accurate 3D laser room scanning, slab vein matching consultation, and custom edge profile selection.",
          },
          {
            title: "CNC Precision Cutting & Edge Profiling",
            description:
              "Diamond-polished mitered waterfall edges, seamless cooktop cutouts, and flush undermount sink profiling.",
          },
          {
            title: "Substrate Reinforcement & Antimicrobial Sealing",
            description:
              "Heavy-duty marine plywood substrate installation, silicone joint bonding, and food-safe impregnating stone sealant application.",
          },
        ],
        seo: {
          metaTitle: "Kitchen Counter Renovation & Quartz Tops | Dwellora",
          metaDescription:
            "Install premium quartz, granite, and porcelain kitchen countertops with Dwellora. Laser precision cutting, waterfall edges, and durable finishes.",
          keywords:
            "kitchen counter renovation, quartz countertops, waterfall island, stone countertop installation, granite kitchen counters",
          ogTitle: "Kitchen Counter Renovation | Dwellora Stone & Surfaces",
          ogDescription:
            "Precision-crafted luxury quartz and stone kitchen countertops engineered for timeless beauty and enduring culinary performance.",
          ogImage: "https://i.ibb.co/twG36fNG/Kitchen-Counter-Renovation.jpg",
          canonicalUrl:
            "https://dwellora.com/services/kitchen-counter-renovation",
        },
      },
      {
        title: "Kitchen Hood Renovation",
        slug: "kitchen-hood-renovation",
        image: "https://i.ibb.co/YByqgqvB/Kitchen-Hood-Renovation.jpg",
        shortDescription:
          "High-performance ventilation engineering paired with bespoke architectural range hood canopies for silent, odor-free cooking.",
        description:
          "Improve indoor air quality and create an architectural centerpiece with Dwellora’s kitchen hood renovation service. Standard exhaust hoods often fail to adequately eliminate cooking fumes or create intrusive noise. We engineer balanced ventilation systems featuring whisper-quiet, multi-speed inline or exterior blowers, high-flow stainless steel baffle filters, and rigid ductwork transitions. Our master carpenters construct custom statement canopies finished in Venetian plaster, fluted hardwoods, or metallic shrouds. From static pressure calculation to seamless ceiling scribe integration, our team ensures peak aerodynamic performance. Enjoy a smoke-free culinary environment, quiet operation, and a breathtaking focal point that complements your cabinetry.",
        includedItems: [
          {
            title: "Ventilation Engineering & Ducting Upgrade",
            description:
              "CFM load calculation, installation of smooth-walled galvanized rigid ductwork, and backdraft damper fitting.",
          },
          {
            title: "Custom Canopy Fabrication & Architectural Cladding",
            description:
              "Framing of custom chimney shapes with plaster, timber, or stainless steel finishes tailored to your kitchen theme.",
          },
          {
            title: "High-Power Blower & Lighting Integration",
            description:
              "Mounting of multi-speed commercial blowers, dishwasher-safe baffle filters, and dimmable warm LED task lighting.",
          },
        ],
        seo: {
          metaTitle: "Kitchen Hood Renovation & Custom Canopies | Dwellora",
          metaDescription:
            "Upgrade your kitchen ventilation with custom range hood canopies and high-CFM extraction systems by Dwellora. Quiet, stylish, and efficient.",
          keywords:
            "kitchen hood renovation, custom range hood canopy, kitchen exhaust ventilation, range hood installation, high CFM kitchen vent",
          ogTitle: "Kitchen Hood Renovation | Dwellora Architectural Hoods",
          ogDescription:
            "Custom architectural range hood canopies engineered with powerful, whisper-quiet ventilation for clean culinary spaces.",
          ogImage: "https://i.ibb.co/YByqgqvB/Kitchen-Hood-Renovation.jpg",
          canonicalUrl: "https://dwellora.com/services/kitchen-hood-renovation",
        },
      },
      {
        title: "Full Kitchen Renovation",
        slug: "full-kitchen-renovation",
        image: "https://i.ibb.co/ymwwG0L8/Full-Kitchen-Renovation.jpg",
        shortDescription:
          "Turnkey gourmet kitchen transformation encompassing structural layout redesign, luxury surfaces, smart storage, and appliance integration.",
        description:
          "Dwellora’s full kitchen renovation delivers complete turnkey transformations that turn the heart of your home into an inspiring culinary haven. From total gutting and MEP rough-ins to custom cabinetry, statement islands, designer tile backsplashes, and integrated panel-ready appliances, our turnkey service handles every detail. We optimize the classic work triangle, integrate layered task and ambient illumination, and use durable luxury materials engineered for high traffic. Throughout the renovation, our project supervisors maintain rigid schedule control and cleanliness. Homeowners gain an entertainer’s paradise with superior ergonomic flow, abundant storage, and substantial long-term property equity.",
        includedItems: [
          {
            title: "Comprehensive Demolition & Utility Rough-Ins",
            description:
              "Complete strip-out, subfloor leveling, dedicated 20-amp electrical circuits, gas line rerouting, and plumbing rough-ins.",
          },
          {
            title: "Full Cabinetry, Island & Surface Installation",
            description:
              "Bespoke solid-core cabinetry, central entertaining island, mitered quartz counters, and designer tile backsplash.",
          },
          {
            title: "Appliance Fitting & Turnkey Commissioning",
            description:
              "Seamless installation of built-in cooking appliances, undermount sink, tapware, and comprehensive plumbing/electrical testing.",
          },
        ],
        seo: {
          metaTitle: "Full Kitchen Renovation Services | Dwellora",
          metaDescription:
            "Transform your kitchen with Dwellora's full kitchen remodeling service. Turnkey design, custom islands, quartz surfaces, and smart storage.",
          keywords:
            "full kitchen renovation, complete kitchen remodel, luxury kitchen design, turnkey kitchen contractor, modern kitchen remodeling",
          ogTitle: "Full Kitchen Renovation | Dwellora Luxury Kitchens",
          ogDescription:
            "Complete luxury kitchen remodeling featuring custom cabinetry, waterfall islands, and turnkey craftsmanship.",
          ogImage: "https://i.ibb.co/ymwwG0L8/Full-Kitchen-Renovation.jpg",
          canonicalUrl: "https://dwellora.com/services/full-kitchen-renovation",
        },
      },
    ],
  },
  {
    name: "Bathroom Renovation",
    id: "6ac4112c079b63ca2b27b041",
    services: [
      {
        title: "Bathroom Remodeling",
        slug: "bathroom-remodeling",
        image: "https://i.ibb.co/spYMRrrp/Bathroom-Remodeling.jpg",
        shortDescription:
          "Complete bathroom transformation with certified waterproofing, large-format porcelain tilework, and luxury modern plumbing fixtures.",
        description:
          "Elevate your daily routine with Dwellora’s comprehensive bathroom remodeling service. We transform dated, moisture-prone bathrooms into spa-inspired private retreats engineered for longevity and effortless maintenance. Our craftsmen strip wet zones to bare studs, applying commercial-grade Schluter waterproofing membranes, updating plumbing stacks, and laying rectified large-format porcelain or marble tiles with stain-proof epoxy grout. We meticulously align all sanitary fixtures, incorporate ambient niches, and install concealed in-wall valves. Enhanced with warm illumination, in-wall cistern toilets, and thermostatic tapware, your remodeled bathroom delivers exceptional comfort, thermal warmth, and peace of mind through guaranteed leak-proof construction.",
        includedItems: [
          {
            title: "Certified Membrane Waterproofing",
            description:
              "Full subfloor and wall waterproofing using continuous vapor-tight membranes and flood-tested shower pans.",
          },
          {
            title: "Precision Large-Format Tile Installation",
            description:
              "Laser-aligned laying of porcelain or natural stone wall and floor tiles finished with epoxy grout lines.",
          },
          {
            title: "Luxury Plumbing & Sanitaryware Fit-Out",
            description:
              "Installation of concealed wall-hung toilets, thermostatic rain showers, heated towel rails, and architectural brassware.",
          },
        ],
        seo: {
          metaTitle: "Luxury Bathroom Remodeling Services | Dwellora",
          metaDescription:
            "Transform your bathroom into a luxury retreat with Dwellora. Certified waterproofing, bespoke tilework, and modern fixtures.",
          keywords:
            "bathroom remodeling, luxury bathroom renovation, modern bathroom design, waterproof bathroom remodel, bathroom contractor",
          ogTitle: "Bathroom Remodeling | Dwellora Spa & Bath Interiors",
          ogDescription:
            "Experience spa-inspired luxury with certified waterproof bathroom remodeling and artisan tile craftsmanship.",
          ogImage: "https://i.ibb.co/spYMRrrp/Bathroom-Remodeling.jpg",
          canonicalUrl: "https://dwellora.com/services/bathroom-remodeling",
        },
      },
      {
        title: "Shower Area Renovation",
        slug: "shower-area-renovation",
        image: "https://i.ibb.co/PZkjRW0g/Shower-Area-Renovation.jpg",
        shortDescription:
          "Curbless walk-in shower installations featuring ultra-clear frameless glass, concealed linear trench drains, and dual rainfall shower systems.",
        description:
          "Upgrade your bathing experience with Dwellora’s custom shower area renovation. We specialize in sleek zero-threshold curbless walk-in showers that visually expand room dimensions while providing universal accessibility. Our process incorporates pre-sloped waterproof shower trays, stainless steel linear drainage systems, and custom niche shelves with integrated LED accent lights. Enclosed with 10mm ultra-clear tempered glass with water-repellent coatings, our shower systems combine hydrotherapy performance with low-maintenance elegance. Master plumbers calibrate thermostatic valves to deliver constant water pressure and temperature stability, transforming your daily shower into a spa-level rejuvenation ritual.",
        includedItems: [
          {
            title: "Zero-Threshold Curbless Base Installation",
            description:
              "Structural joist recessing, pre-sloped screed formation, and linear trench drain integration with flood testing.",
          },
          {
            title: "Frameless Tempered Glass Enclosures",
            description:
              "Custom-cut 10mm safety glass with anti-limescale coating and solid brass architectural mounting clamps.",
          },
          {
            title: "Thermostatic Rainfall & Handheld Valve System",
            description:
              "Concealed thermostatic pressure-balanced mixer valve, ceiling flush rain head, and magnetic handheld spray wand.",
          },
        ],
        seo: {
          metaTitle: "Curbless Walk-in Shower Area Renovation | Dwellora",
          metaDescription:
            "Upgrade to a curbless walk-in shower with frameless glass and rainfall showerheads by Dwellora. Seamless, elegant, and fully waterproof.",
          keywords:
            "shower area renovation, curbless walk-in shower, frameless glass shower, rainfall showerhead, linear drain shower",
          ogTitle: "Shower Area Renovation | Dwellora Modern Bathrooms",
          ogDescription:
            "Curbless walk-in showers engineered with frameless tempered glass and concealed linear drains for ultimate luxury.",
          ogImage: "https://i.ibb.co/PZkjRW0g/Shower-Area-Renovation.jpg",
          canonicalUrl: "https://dwellora.com/services/shower-area-renovation",
        },
      },
      {
        title: "Vanity Installation",
        slug: "vanity-installation",
        image: "https://i.ibb.co/ZnPTLtK/Vanity-Installation.jpg",
        shortDescription:
          "Custom floating and freestanding vanity installations with seamless quartz countertops, dual undermount basins, and LED ambient mirrors.",
        description:
          "Anchor your bathroom design with Dwellora’s bespoke vanity installation service. Whether you prefer a weightless wall-hung floating console with under-cabinet motion lighting or a solid timber freestanding unit, we guarantee structural wall reinforcement and precise plumbing alignment. Each installation includes custom quartz or marble vanity tops, undermount ceramic basins, anti-fingerprint hardware, and smart backlit anti-fog mirrors. Our skilled technicians secure all water lines, test drainage speed, and seal edges with antimicrobial color-matched silicone. Enjoy ample organized storage, pristine silicone lines, and a high-end centerpiece that defines your bathroom aesthetic with durable sophistication.",
        includedItems: [
          {
            title: "Structural Wall Anchoring & Leveling",
            description:
              "In-wall timber blocking reinforcement and heavy-duty steel support bracket installation for zero-deflection mounting.",
          },
          {
            title: "Quartz Vanity Top & Undermount Basin Fitting",
            description:
              "Precision mounting of polished quartz surfaces with factory-sealed undermount sinks and overflow assemblies.",
          },
          {
            title: "Plumbing Hookup & Backlit Mirror Integration",
            description:
              "Connection of high-flow P-traps, designer widespread tapware, and installation of anti-fog LED illuminated mirrors.",
          },
        ],
        seo: {
          metaTitle: "Custom Bathroom Vanity Installation | Dwellora",
          metaDescription:
            "Professional bathroom vanity installation by Dwellora. Floating consoles, quartz countertops, undermount sinks, and LED mirror setups.",
          keywords:
            "vanity installation, floating bathroom vanity, custom vanity console, bathroom sink installation, quartz vanity top",
          ogTitle: "Vanity Installation | Dwellora Custom Bath Consoles",
          ogDescription:
            "Bespoke bathroom vanity installation with floating timber consoles, luxury stone surfaces, and integrated illumination.",
          ogImage: "https://i.ibb.co/ZnPTLtK/Vanity-Installation.jpg",
          canonicalUrl: "https://dwellora.com/services/vanity-installation",
        },
      },
    ],
  },
  {
    name: "Custom Furniture",
    id: "6ac41d5675c98ae114364612",
    services: [
      {
        title: "Custom TV Unit Design",
        slug: "custom-tv-unit-design",
        image: "https://i.ibb.co/Y74tjCTf/Custom-TV-Unit-Design.jpg",
        shortDescription:
          "Architectural media feature walls with concealed wiring, fluted wood paneling, floating credenzas, and integrated ambient backlighting.",
        description:
          "Elevate your primary entertainment space with Dwellora’s custom TV media unit design service. We create bespoke architectural feature walls that seamlessly merge audiovisual technology with handcrafted woodwork. Incorporating fluted timber slats, large-format sintered stone backdrops, floating consoles, and hidden in-wall conduit chases, our designs eliminate visible wires completely. Integrated diffused warm LED lighting adds theater-grade ambiance while push-to-open soft-close drawers conceal media equipment. Our master cabinetmakers ensure flush alignments, sound dampening, and custom thermal venting for electronics. Experience a clean, luxurious entertainment hub tailored to your room’s exact proportions.",
        includedItems: [
          {
            title: "Architectural 3D Media Wall Concept",
            description:
              "Custom layout planning combining fluted oak or walnut paneling, stone accent slabs, and TV mount positioning.",
          },
          {
            title: "In-Wall Conduit & Cable Management",
            description:
              "Concealed high-speed AV routing, power outlet repositioning, component ventilation, and soundbar integration.",
          },
          {
            title: "Floating Console & LED Illumination",
            description:
              "Fabrication of soft-close floating storage drawers with integrated dimmable ambient channel lighting.",
          },
        ],
        seo: {
          metaTitle: "Custom TV Unit Design & Media Walls | Dwellora",
          metaDescription:
            "Design bespoke TV units and media walls with Dwellora. Fluted timber paneling, concealed cable management, and floating cabinetry.",
          keywords:
            "custom tv unit design, media wall renovation, floating tv credenza, fluted wood wall panel, entertainment unit cabinetry",
          ogTitle: "Custom TV Unit Design | Dwellora Bespoke Living Spaces",
          ogDescription:
            "Architectural media walls and bespoke TV units designed with fluted hardwood, concealed wiring, and integrated LED lighting.",
          ogImage: "https://i.ibb.co/Y74tjCTf/Custom-TV-Unit-Design.jpg",
          canonicalUrl: "https://dwellora.com/services/custom-tv-unit-design",
        },
      },
      {
        title: "Custom Dining Furniture",
        slug: "custom-dining-furniture",
        image: "https://i.ibb.co/KptZshgT/Custom-Dining-Furniture.jpg",
        shortDescription:
          "Handcrafted solid hardwood dining tables, ergonomic banquette seating, and bespoke credenzas built to heirloom quality.",
        description:
          "Gather your family around bespoke dining furniture built by Dwellora’s master craftsmen. We hand-select premium kiln-dried hardwoods including American walnut, white oak, and ash, creating dining tables with sculptural bases and durable hand-rubbed hardwax oil finishes. Our service extends to custom banquette seating, upholstered bench booths, and matching buffet sideboards designed to maximize seating capacity and flow. Using traditional mortise-and-tenon joints, we construct furniture that resists seasonal warping and heavy everyday dining use. Invest in heirloom-grade furniture tailored to your dining room’s exact scale, bringing warmth, comfort, and distinction to every shared meal.",
        includedItems: [
          {
            title: "Hardwood Timber Selection & Milling",
            description:
              "Hand-curated kiln-dried hardwood slabs chosen for distinctive grain continuity and structural stability.",
          },
          {
            title: "Artisan Joinery & Sculptural Base Construction",
            description:
              "Traditional mortise-and-tenon craftsmanship combined with custom timber or matte powder-coated steel bases.",
          },
          {
            title: "Stain-Proof Protective Finish Application",
            description:
              "Application of durable, food-safe ceramic-infused matte lacquers or natural plant-based hardwax oils.",
          },
        ],
        seo: {
          metaTitle: "Custom Dining Furniture & Hardwood Tables | Dwellora",
          metaDescription:
            "Handcrafted solid wood dining tables and bespoke dining room furniture by Dwellora. Heirloom quality craftsmanship in walnut and oak.",
          keywords:
            "custom dining furniture, solid wood dining table, bespoke dining room, handcrafted dining table, custom banquette seating",
          ogTitle: "Custom Dining Furniture | Dwellora Artisan Woodworking",
          ogDescription:
            "Heirloom-grade solid hardwood dining tables and custom banquettes crafted with traditional joinery and premium finishes.",
          ogImage: "https://i.ibb.co/KptZshgT/Custom-Dining-Furniture.jpg",
          canonicalUrl:
            "https://dwellora.com/services/custom-dining-furniture",
        },
      },
      {
        title: "Built-in Furniture Design",
        slug: "built-in-furniture-design",
        image: "https://i.ibb.co/s9r8NRVJ/Built-in-Furniture-Design.jpg",
        shortDescription:
          "Floor-to-ceiling built-in bookcases, home office executive workstations, and alcove joinery fitted flush with your architecture.",
        description:
          "Maximize awkward alcoves and transform unused wall space with Dwellora’s custom built-in furniture design. From expansive library bookshelves with rolling ladders to ergonomic home office workstations, our carpenters build seamless architectural joinery that integrates with your baseboards, crown moldings, and room contours. We utilize moisture-resistant high-density cores with solid timber veneers and durable spray finishes. Every module is tailored around your storage priorities, integrating hidden cable ports and dimmable channel lighting. Homeowners gain expansive, organized storage and dedicated functional zones that feel entirely integral to the home’s original architecture.",
        includedItems: [
          {
            title: "Laser Site Survey & Space Planning",
            description:
              "Precision laser mapping of alcoves and ceiling slopes to guarantee flush, zero-gap custom millwork fitment.",
          },
          {
            title: "Bespoke Cabinetry & Heavy-Load Shelving",
            description:
              "Fabrication of reinforced adjustable shelving, soft-close storage cabinets, and integrated desk workspaces.",
          },
          {
            title: "Seamless Scribe Trim & Factory Finishing",
            description:
              "Custom crown and baseboard molding integration, concealed power wire channels, and smooth factory paint finish.",
          },
        ],
        seo: {
          metaTitle: "Custom Built-in Furniture & Joinery Design | Dwellora",
          metaDescription:
            "Maximize your living space with custom built-in bookcases, executive home office desks, and alcove joinery by Dwellora.",
          keywords:
            "built-in furniture design, custom built-in bookcases, home office joinery, alcove cabinetry, architectural millwork",
          ogTitle: "Built-in Furniture Design | Dwellora Architectural Millwork",
          ogDescription:
            "Floor-to-ceiling built-in bookcases, executive home office workstations, and architectural alcove cabinetry.",
          ogImage: "https://i.ibb.co/s9r8NRVJ/Built-in-Furniture-Design.jpg",
          canonicalUrl:
            "https://dwellora.com/services/built-in-furniture-design",
        },
      },
    ],
  },
  {
    name: "Wardrobe & Cabinet",
    id: "6ac41ed775c98ae114364613",
    services: [
      {
        title: "Bedroom Wardrobe Design",
        slug: "bedroom-wardrobe-design",
        image: "https://i.ibb.co/WW2hYLSN/Bedroom-Wardrobe-Design.jpg",
        shortDescription:
          "Custom walk-in dressing suites and fitted wardrobes with fluted glass doors, tailored organizers, and automated sensor lighting.",
        description:
          "Transform your bedroom into a boutique dressing suite with Dwellora’s custom wardrobe design service. We craft floor-to-ceiling fitted wardrobes and luxurious walk-in closets tailored to your wardrobe collection. Featuring fluted glass doors with anodized aluminum framing, velvet-lined jewelry drawers, pull-out trouser racks, and illuminated shoe display tiers, our systems optimize every cubic inch. Integrated motion-sensor warm LED lighting turns dressing into an effortless daily luxury, while soft-close German sliding mechanisms ensure whisper-quiet operation. Experience a clutter-free sanctuary built with durable materials that safeguard your finest attire.",
        includedItems: [
          {
            title: "Custom Interior Layout & Compartment Design",
            description:
              "Tailored modular zones for full-length garments, pull-out accessory trays, velvet jewelry inserts, and shoe display shelves.",
          },
          {
            title: "Premium Architectural Doors & Mechanisms",
            description:
              "Slim-frame fluted glass doors, soft-close sliding tracks, or acoustic upholstered hinged panel systems.",
          },
          {
            title: "Automated Sensor Illumination & Mirrors",
            description:
              "Recessed vertical LED channel lighting with magnetic proximity sensors and integrated full-length bronze-tinted mirrors.",
          },
        ],
        seo: {
          metaTitle: "Custom Bedroom Wardrobes & Walk-in Closets | Dwellora",
          metaDescription:
            "Design custom fitted wardrobes and luxury walk-in closets with Dwellora. Fluted glass doors, smart organization, and automated LED lighting.",
          keywords:
            "bedroom wardrobe design, custom fitted wardrobes, walk-in closet renovation, luxury wardrobe maker, modern closet organization",
          ogTitle: "Bedroom Wardrobe Design | Dwellora Luxury Wardrobes",
          ogDescription:
            "Bespoke fitted wardrobes and walk-in dressing suites crafted with integrated LED lighting and smart compartment storage.",
          ogImage: "https://i.ibb.co/WW2hYLSN/Bedroom-Wardrobe-Design.jpg",
          canonicalUrl:
            "https://dwellora.com/services/bedroom-wardrobe-design",
        },
      },
      {
        title: "Storage Cabinet Installation",
        slug: "storage-cabinet-installation",
        image: "https://i.ibb.co/3yBcSPtY/Storage-Cabinet-Installation.jpg",
        shortDescription:
          "Heavy-duty utility, laundry, and mudroom storage cabinetry engineered with moisture-resistant materials and versatile internal organizers.",
        description:
          "Eliminate household clutter with Dwellora’s custom storage cabinet installation service. We engineer high-capacity storage solutions for mudrooms, laundry rooms, and utility corridors that endure demanding everyday use. Utilizing moisture-resistant core boards, scratch-proof laminated finishes, and heavy-duty European drawer slides, our cabinets accommodate heavy equipment, laundry appliances, and household essentials. Our installers scribe each unit tightly against wall irregularities, anchoring into wall studs for supreme stability. Enjoy seamless wall-to-wall scribing, custom adjustable shelving, and a refined aesthetic that keeps your utility spaces immaculately organized.",
        includedItems: [
          {
            title: "Moisture-Resistant Heavy-Duty Fabrication",
            description:
              "High-density moisture-resistant core carcasses engineered to withstand humid utility and laundry environments.",
          },
          {
            title: "Modular Adjustable Shelving & Deep Drawers",
            description:
              "Full-extension heavy load slides, adjustable stainless shelf pins, and custom linen and cleaning utility organizers.",
          },
          {
            title: "Precision Scribe Installation & Soft-Close Tuning",
            description:
              "Baseboard coping, seamless ceiling crown integration, wall anchoring, and fine hinge alignment for quiet soft closure.",
          },
        ],
        seo: {
          metaTitle: "Custom Storage Cabinet Installation | Dwellora",
          metaDescription:
            "Organize your mudroom and laundry space with custom storage cabinets by Dwellora. Durable moisture-resistant joinery with smart utility storage.",
          keywords:
            "storage cabinet installation, mudroom storage joinery, laundry room cabinets, utility storage cabinets, custom hallway cabinetry",
          ogTitle: "Storage Cabinet Installation | Dwellora Functional Joinery",
          ogDescription:
            "Heavy-duty custom storage cabinetry designed for mudrooms and laundry areas with moisture-resistant durability.",
          ogImage: "https://i.ibb.co/3yBcSPtY/Storage-Cabinet-Installation.jpg",
          canonicalUrl:
            "https://dwellora.com/services/storage-cabinet-installation",
        },
      },
    ],
  },
  {
    name: "Doors, Windows & Frames",
    id: "6ac41fec75c98ae114364614",
    services: [
      {
        title: "Wooden Door Installation",
        slug: "wooden-door-installation",
        image: "https://i.ibb.co/VcpnhWP9/Wooden-Door-Installation.jpg",
        shortDescription:
          "Solid timber interior and entry door installations with acoustic jamb seals, 3D concealed hinges, and biometric smart lock systems.",
        description:
          "Make a lasting architectural impression with Dwellora’s wooden door installation service. We fit custom solid timber exterior entry pivot doors and flush frameless interior doors that combine visual grandeur with high security. Our technicians ensure laser-plumb frame alignment, sound-dampening acoustic perimeter seals, and CNC mortised 3D concealed hinges for completely smooth, silent operation. We finish all wood surfaces with UV-resistant coatings and fit precision biometric locking systems. Upgrading your doors enhances thermal insulation, reduces room-to-room noise transfer, and imparts a tangible feeling of luxury every time you enter.",
        includedItems: [
          {
            title: "Laser Frame Squaring & Acoustic Weather-Sealing",
            description:
              "Plumb laser leveling of door jambs with continuous sound-dampening rubber perimeter gaskets and threshold seals.",
          },
          {
            title: "3D Concealed Hinge & Magnetic Latch Mortising",
            description:
              "Precision CNC mortising for invisible adjustable 3D hinges and whisper-quiet magnetic latch strike mechanisms.",
          },
          {
            title: "Architectural Hardware & Smart Lock Fitting",
            description:
              "Installation of custom solid brass pull handles, privacy locksets, or integrated biometric keyless entry systems.",
          },
        ],
        seo: {
          metaTitle: "Custom Wooden Door Installation & Frames | Dwellora",
          metaDescription:
            "Install handcrafted solid timber doors with Dwellora. Concealed hinges, acoustic jamb sealing, and architectural hardware.",
          keywords:
            "wooden door installation, custom interior doors, solid wood pivot entry door, frameless doors, acoustic door installation",
          ogTitle: "Wooden Door Installation | Dwellora Doors & Architectural Frames",
          ogDescription:
            "Handcrafted solid wood doors with invisible hinges and acoustic insulation for effortless luxury and security.",
          ogImage: "https://i.ibb.co/VcpnhWP9/Wooden-Door-Installation.jpg",
          canonicalUrl:
            "https://dwellora.com/services/wooden-door-installation",
        },
      },
      {
        title: "Window Replacement Service",
        slug: "window-replacement-service",
        image: "https://i.ibb.co/wrxF25GV/Window-Replacement-Service.jpg",
        shortDescription:
          "High-performance double and triple-glazed window retrofits with thermally broken frames for superior insulation and acoustic quiet.",
        description:
          "Enhance indoor comfort, lower heating and cooling costs, and flood your interiors with natural light through Dwellora’s window replacement service. We install custom energy-efficient double and triple-glazed window units featuring Low-E coatings, argon gas fills, and thermally broken timber or aluminum frames. Our meticulous installation includes complete rough opening waterproofing, non-expanding foam insulation, and custom interior casing trim. Our team tests every sash for airtight closure and effortless gliding mechanics. Homeowners enjoy serene acoustic quiet, eliminated drafts, improved security, and elevated exterior architectural appeal.",
        includedItems: [
          {
            title: "Careful Extraction & Flashing Membrane Prep",
            description:
              "Safe removal of existing window units, rough opening squaring, and high-performance self-adhesive flashing barrier installation.",
          },
          {
            title: "Energy-Efficient Glazing & Thermal Foam Seal",
            description:
              "Precision placement of Low-E argon-filled double/triple glazed units with closed-cell low-expansion thermal perimeter foam.",
          },
          {
            title: "Exterior Metal Capping & Interior Trim Scribing",
            description:
              "Maintenance-free exterior aluminum cladding with custom interior hardwood sill and apron casing carpentry.",
          },
        ],
        seo: {
          metaTitle: "Energy-Efficient Window Replacement Service | Dwellora",
          metaDescription:
            "Upgrade your home with double-glazed window replacement by Dwellora. Superior thermal insulation, soundproofing, and custom architectural framing.",
          keywords:
            "window replacement service, energy efficient windows, double glazed windows, custom window frames, soundproof window installation",
          ogTitle: "Window Replacement Service | Dwellora Architectural Windows",
          ogDescription:
            "High-performance energy-efficient window replacements delivering whisper-quiet soundproofing and superior thermal efficiency.",
          ogImage: "https://i.ibb.co/wrxF25GV/Window-Replacement-Service.jpg",
          canonicalUrl:
            "https://dwellora.com/services/window-replacement-service",
        },
      },
    ],
  },
  {
    name: "Wooden Flooring & Decking",
    id: "6ac4216775c98ae114364615",
    services: [
      {
        title: "Wooden Flooring Installation",
        slug: "wooden-flooring-installation",
        image: "https://i.ibb.co/60dkZ7cD/Wooden-Flooring-Installation.jpg",
        shortDescription:
          "Master installation of wide-plank engineered European oak, solid hardwood, and chevron parquet with acoustic underlayment.",
        description:
          "Anchor your home with the natural beauty and warmth of hardwood flooring installed by Dwellora’s master floor layers. We specialize in wide-plank engineered European oak, solid hardwood, and intricate herringbone and chevron parquet patterns. Our installation begins with subfloor moisture testing and laser self-leveling to ensure a completely flat, silent foundation. Secured with elastic acoustic adhesives or blind nailing and paired with flush floor vents and matching trim, your new floors provide enduring durability, timeless style, and a luxurious feel underfoot that elevates your entire interior design.",
        includedItems: [
          {
            title: "Subfloor Moisture Testing & Laser Leveling",
            description:
              "Electronic moisture mapping, vapor barrier application, and self-leveling screed for a flat subfloor foundation.",
          },
          {
            title: "Precision Hardwood & Parquet Laying",
            description:
              "Full-spread elastic silane adhesive bonding or hidden nail installation of wide-plank oak and parquet patterns.",
          },
          {
            title: "Flush Transitions & Base Trim Finishing",
            description:
              "Installation of seamless flush wood transition reducers, integrated flush floor register vents, and matching shoe molding.",
          },
        ],
        seo: {
          metaTitle: "Hardwood & Parquet Wooden Flooring Installation | Dwellora",
          metaDescription:
            "Professional wooden flooring installation by Dwellora. Wide-plank European oak, herringbone parquet, and precision subfloor leveling.",
          keywords:
            "wooden flooring installation, engineered hardwood flooring, herringbone parquet, European oak floors, floor leveling contractor",
          ogTitle: "Wooden Flooring Installation | Dwellora Artisan Floors",
          ogDescription:
            "Master installation of wide-plank European oak and parquet floors engineered for silent acoustic stability and beauty.",
          ogImage: "https://i.ibb.co/60dkZ7cD/Wooden-Flooring-Installation.jpg",
          canonicalUrl:
            "https://dwellora.com/services/wooden-flooring-installation",
        },
      },
      {
        title: "Outdoor Decking Service",
        slug: "outdoor-decking-service",
        image: "https://i.ibb.co/G3fDxnxq/Outdoor-Decking-Service.jpg",
        shortDescription:
          "Custom outdoor living decks built with premium hardwoods, composite boards, concealed fasteners, and integrated step lighting.",
        description:
          "Extend your interior living space into the open air with Dwellora’s custom outdoor decking service. We construct luxury outdoor terraces, pool surrounds, and garden decks using premium hardwoods such as teak and ipe, as well as capped composite boards. Our team engineers rot-resistant substructures on concrete footings and secures boards with concealed clip fasteners for smooth, barefoot-safe surfaces. Complete with integrated low-voltage stair lighting and sleek railings, our decks create an inviting outdoor entertainment environment built to withstand harsh weather while requiring minimal maintenance.",
        includedItems: [
          {
            title: "Concrete Footings & Subframe Engineering",
            description:
              "Excavation of frost-depth concrete piers and laser-leveled heavy-duty treated timber or aluminum joist framing.",
          },
          {
            title: "Concealed Clip Fastening & Picture-Framing",
            description:
              "Even board laying with hidden clip systems, seamless picture-frame borders, and precision mitered corner joints.",
          },
          {
            title: "Integrated Step Lighting & Protective UV Sealing",
            description:
              "Installation of low-voltage recessed LED step lighting and application of penetrating deep-feed UV protective oils.",
          },
        ],
        seo: {
          metaTitle: "Custom Outdoor Decking & Patio Services | Dwellora",
          metaDescription:
            "Build your dream outdoor deck with Dwellora. Premium hardwoods, composite decking, concealed fasteners, and integrated lighting.",
          keywords:
            "outdoor decking service, custom timber deck, composite decking installation, patio deck renovation, hardwood deck builder",
          ogTitle: "Outdoor Decking Service | Dwellora Outdoor Living",
          ogDescription:
            "Custom luxury outdoor living decks built with weather-resistant hardwoods, hidden fasteners, and integrated step lighting.",
          ogImage: "https://i.ibb.co/G3fDxnxq/Outdoor-Decking-Service.jpg",
          canonicalUrl: "https://dwellora.com/services/outdoor-decking-service",
        },
      },
    ],
  },
  {
    name: "Painting, Wall Finishing & Interior Design",
    id: "6ac4244d75c98ae114364616",
    services: [
      {
        title: "Interior Painting Service",
        slug: "interior-painting-service",
        image: "https://i.ibb.co/DP8jg7yf/Interior-Painting-Service.jpg",
        shortDescription:
          "Flawless interior painting featuring Level 5 drywall skim prep, dustless HEPA sanding, and premium washable architectural paints.",
        description:
          "Transform your interior atmosphere with Dwellora’s fine interior painting service. We believe the secret to lasting beauty lies in meticulous preparation. Our team protects all floors and furnishings before skim-coating imperfections, repairing hairline drywall cracks, and executing dustless HEPA vacuum sanding to achieve a silky Level 5 finish. Utilizing low-VOC, highly pigmented paints from Benjamin Moore and Farrow & Ball, we deliver crisp cut lines, rich color depth, and washable durability. Our structured process ensures clean work zones, fast turnaround times, and stunning surfaces that brighten and protect your living spaces.",
        includedItems: [
          {
            title: "Complete Masking & Protection Containment",
            description:
              "Heavy-duty floor rosin paper drop cloths, poly containment barriers, and automotive-grade masking tape application.",
          },
          {
            title: "Level 5 Drywall Prep & Dustless Sanding",
            description:
              "Complete skim coating, patch remediation, and vacuum-assisted dustless sanding for glass-smooth wall surfaces.",
          },
          {
            title: "Multi-Coat Designer Paint Application",
            description:
              "Application of high-adhesion stain-blocking primer followed by two uniform coats of luxury designer architectural paint.",
          },
        ],
        seo: {
          metaTitle: "Fine Interior Painting Services | Dwellora",
          metaDescription:
            "Professional interior painting by Dwellora. Level 5 drywall prep, dustless sanding, and premium low-VOC designer architectural paints.",
          keywords:
            "interior painting service, luxury house painters, Level 5 drywall finish, residential painting contractor, designer paint finish",
          ogTitle: "Interior Painting Service | Dwellora Fine Finishes",
          ogDescription:
            "Transform your interior walls with flawless dustless preparation, laser-sharp cut lines, and designer paint palettes.",
          ogImage: "https://i.ibb.co/DP8jg7yf/Interior-Painting-Service.jpg",
          canonicalUrl:
            "https://dwellora.com/services/interior-painting-service",
        },
      },
      {
        title: "Wall Panelling & Decorative Finishing",
        slug: "wall-panelling-decorative-finishing",
        image: "https://i.ibb.co/gLnXc40W/Wall-Panelling-Decorative-Finishing.jpg",
        shortDescription:
          "Bespoke wainscoting, acoustic fluted timber slat panels, and hand-troweled Venetian plaster accent walls for tactile elegance.",
        description:
          "Elevate plain drywall into architectural statements with Dwellora’s wall panelling and decorative finishing service. We create custom classic wainscoting, board-and-batten grids, fluted wood slat feature walls with acoustic felt backing, and authentic Italian Venetian plaster. These tactile finishes add depth, sophisticated shadows, and sound dampening to dining rooms, master bedrooms, and entryways. Our craftsmen laser-level battens and apply protective burnished waxes to ensure lasting richness. Handcrafted with precision mitering and seamless finishing, our wall treatments impart timeless architectural character to any room.",
        includedItems: [
          {
            title: "Custom Symmetrical Layout & Framing",
            description:
              "Laser measurement and architectural proportion planning for balanced wainscoting and slat panel layouts.",
          },
          {
            title: "Artisanal Venetian Plaster & Textures",
            description:
              "Hand-troweling of mineral lime plaster or Roman clay with protective natural wax burnishing for subtle sheen.",
          },
          {
            title: "Fine Millwork Scribing & Seamless Spray Finish",
            description:
              "Precision coping of panel moldings, caulked seamless joints, and multi-coat satin lacquer spray finishing.",
          },
        ],
        seo: {
          metaTitle: "Custom Wall Panelling & Venetian Plaster | Dwellora",
          metaDescription:
            "Elevate your home with custom wainscoting, fluted timber wall panels, and authentic Venetian plaster finishes by Dwellora.",
          keywords:
            "wall panelling, decorative wall finishing, wainscoting installation, Venetian plaster, fluted timber acoustic panels",
          ogTitle: "Wall Panelling & Decorative Finishing | Dwellora Interiors",
          ogDescription:
            "Bespoke wainscoting, acoustic wood slat paneling, and hand-troweled Venetian plaster crafted for tactile elegance.",
          ogImage:
            "https://i.ibb.co/gLnXc40W/Wall-Panelling-Decorative-Finishing.jpg",
          canonicalUrl:
            "https://dwellora.com/services/wall-panelling-decorative-finishing",
        },
      },
      {
        title: "False Ceiling Design & Installation",
        slug: "false-ceiling-design-installation",
        image: "https://i.ibb.co/LD9Bf2ny/False-Ceiling-Design-Installation.jpg",
        shortDescription:
          "Architectural suspended ceilings featuring indirect LED cove lighting troughs, shadow-line perimeters, and acoustic optimization.",
        description:
          "Add drama and architectural depth to your overhead space with Dwellora’s false ceiling design and installation service. We construct multi-tiered dropped ceilings, negative shadow-line reveals, and recessed perimeter lighting troughs that wash ceilings in soft, glare-free indirect illumination. These installations conceal unsightly ductwork, electrical conduits, and structural beams while dramatically improving room acoustics. Our builders engineer rigid galvanized suspension grids and seal drywall joints with anti-crack tape. Enjoy balanced ambient light, modern architectural clean lines, and an elevated spatial ambiance in your living and dining areas.",
        includedItems: [
          {
            title: "Galvanized Steel Suspension Framework",
            description:
              "Laser-leveled hanging grid using heavy-gauge galvanized furring channels engineered for structural safety and rigidity.",
          },
          {
            title: "Gypsum Board Skinning & Shadow Reveals",
            description:
              "Installation of moisture-resistant tapered-edge drywall with crisp architectural perimeter shadow-line reveals.",
          },
          {
            title: "Concealed LED Light Coves & Spot Cutouts",
            description:
              "Forming of indirect LED illumination troughs, recessed spotlight cutouts, and pre-wired magnetic track channels.",
          },
        ],
        seo: {
          metaTitle: "Architectural False Ceiling Design & Lighting | Dwellora",
          metaDescription:
            "Transform your ceiling with suspended gypsum false ceilings, concealed LED cove lighting, and acoustic optimization by Dwellora.",
          keywords:
            "false ceiling design, suspended ceiling installation, drop ceiling cove lighting, architectural ceiling, modern gypsum ceiling",
          ogTitle: "False Ceiling Design & Installation | Dwellora Ceilings",
          ogDescription:
            "Architectural suspended ceilings featuring negative shadow reveals and concealed ambient LED cove illumination.",
          ogImage:
            "https://i.ibb.co/LD9Bf2ny/False-Ceiling-Design-Installation.jpg",
          canonicalUrl:
            "https://dwellora.com/services/false-ceiling-design-installation",
        },
      },
    ],
  },
];

const allDocuments: any[] = [];
const baseDate = new Date("2026-10-06T00:00:00.000Z");

for (const cat of categories) {
  for (const s of cat.services) {
    const doc = {
      _id: {
        $oid: new ObjectId().toHexString(),
      },
      title: s.title,
      slug: s.slug,
      shortDescription: s.shortDescription,
      description: s.description,
      image: s.image,
      includedItems: s.includedItems,
      seo: s.seo,
      categoryId: {
        $oid: cat.id,
      },
      status: "published",
      createdAt: {
        $date: baseDate.toISOString(),
      },
      updatedAt: {
        $date: baseDate.toISOString(),
      },
    };
    allDocuments.push(doc);
  }
}

if (allDocuments.length !== 21) {
  throw new Error(`Expected 21 documents, got ${allDocuments.length}`);
}

const jsonOutput = JSON.stringify(allDocuments, null, 2);
fs.writeFileSync("src/seed/services.import.json", jsonOutput, "utf-8");
console.log(`Successfully generated ${allDocuments.length} service documents in src/seed/services.import.json`);
