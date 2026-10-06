import "dotenv/config";
import { ObjectId } from "mongodb";
import { connectDatabase, getDatabase } from "../config/database.js";
import {
  type Service,
  type IncludedItem,
  type SeoSettings,
} from "../models/service.models.js";
import { categoryCollection } from "../models/category.models.js";

/**
 * Normalizes and converts ImgBB URLs:
 * - Converts https://i.ibb.co.com/ to https://i.ibb.co/
 * - Strips any trailing dots in hostname (e.g., i.ibb.co. -> i.ibb.co)
 * - Trims whitespace
 */
export function sanitizeImgBbUrl(url: string): string {
  if (!url) return url;
  let sanitized = url.trim();

  // Convert https://i.ibb.co.com/ or http://i.ibb.co.com/ to https://i.ibb.co/
  sanitized = sanitized.replace(/^https?:\/\/i\.ibb\.co\.com\//i, "https://i.ibb.co/");
  sanitized = sanitized.replace(/i\.ibb\.co\.com/gi, "i.ibb.co");

  // Fix any trailing dot in hostname
  sanitized = sanitized.replace(/i\.ibb\.co\./gi, "i.ibb.co");

  return sanitized;
}

/**
 * CATEGORY CONFIGURATION & PLACEHOLDERS:
 * You can provide your custom category ObjectIds below, or leave them as placeholders.
 * If category documents exist in the `service_categories` collection, the script will
 * automatically resolve matching category IDs by slug, falling back to these IDs.
 */
export const CATEGORY_IDS: Record<string, string> = {
  "full-home-renovation": "65f000000000000000000001",
  "kitchen-renovation": "65f000000000000000000002",
  "bathroom-renovation": "65f000000000000000000003",
  "living-room-carpentry": "65f000000000000000000004",
  "flooring-tile-installation": "65f000000000000000000005",
  "painting-wall-finishing": "65f000000000000000000006",
};

export interface SeedServiceInput {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  categorySlugHint?: string; // Used to auto-match category if present in DB
  categoryId?: string | ObjectId;
  includedItems: IncludedItem[];
  seo: SeoSettings;
}

/**
 * Professional Renovation Services Seed Data
 * You can update image URLs and category IDs here or provide them separately.
 */
export const SEED_SERVICES: SeedServiceInput[] = [
  {
    title: "Complete Architectural Home Renovation",
    slug: "complete-architectural-home-renovation",
    categorySlugHint: "full-home-renovation",
    categoryId: CATEGORY_IDS["full-home-renovation"],
    // Uses https://i.ibb.co.com/ to demonstrate automatic conversion to https://i.ibb.co/
    image: "https://i.ibb.co.com/6cMh5yZ/full-home-renovation.jpg",
    shortDescription:
      "Full-scale interior and structural home remodeling delivered with meticulous craftsmanship, dedicated project management, and refined architectural aesthetics.",
    description:
      "Transform your residence into a timeless sanctuary designed around how you live. Our comprehensive whole-home renovation service orchestrates every phase from initial architectural concept and space planning through to structural enhancements, bespoke millwork, and luxury finish detailing.\n\nWe collaborate closely with you to reimagine room layouts, optimize natural lighting, and integrate modern comforts seamlessly into your home's character. With dedicated on-site supervision and uncompromising standards for materials and execution, Dwellora ensures your renovation journey is smooth, transparent, and undeniably rewarding.",
    includedItems: [
      {
        title: "Architectural & Interior Design Consultation",
        description:
          "Comprehensive spatial analysis, 3D renderings, and material palettes tailored to your aesthetic vision.",
      },
      {
        title: "Structural Modifications & Demolition",
        description:
          "Safe removal of non-load-bearing walls, structural framing reinforcement, and clean preparation of work zones.",
      },
      {
        title: "Electrical, Plumbing & HVAC Upgrades",
        description:
          "Code-compliant rerouting of utilities, recessed architectural lighting, and modern climate integration.",
      },
      {
        title: "Premium Flooring & Custom Millwork",
        description:
          "Bespoke cabinetry, trim molding, and seamless installation of hardwood, engineered timber, or stone flooring.",
      },
      {
        title: "Dedicated Project Supervision & 2-Year Warranty",
        description:
          "Daily site oversight, milestone inspections, detailed schedule tracking, and a comprehensive craftsmanship warranty.",
      },
    ],
    seo: {
      metaTitle: "Complete Architectural Home Renovation | Dwellora",
      metaDescription:
        "Elevate your living space with Dwellora's full-scale home renovation services. Exceptional craftsmanship, bespoke interiors, and end-to-end project management.",
      keywords:
        "full home renovation, whole house remodel, architectural remodeling, luxury home renovation, interior transformation",
      ogTitle: "Complete Architectural Home Renovation | Dwellora",
      ogDescription:
        "End-to-end luxury home remodeling crafted with precision, premium materials, and timeless design.",
      ogImage: "https://i.ibb.co.com/6cMh5yZ/full-home-renovation.jpg",
      canonicalUrl: "https://dwellora.com/services/complete-architectural-home-renovation",
    },
  },
  {
    title: "Bespoke Chef's Kitchen Remodel",
    slug: "bespoke-chefs-kitchen-remodel",
    categorySlugHint: "kitchen-renovation",
    categoryId: CATEGORY_IDS["kitchen-renovation"],
    image: "https://i.ibb.co.com/QFkbVB1m/kitchen-renovation.jpg",
    shortDescription:
      "Custom cabinetry, statement island counters, and high-performance kitchen ergonomics tailored for culinary passion and sophisticated entertaining.",
    description:
      "The kitchen is the pulsating heart of the modern home. Our bespoke kitchen remodeling service combines culinary-grade ergonomics with handcrafted artistry to create an inspiring culinary environment.\n\nFrom hand-selected quartz and quartzite worktops to custom soft-close cabinetry with tailored internal organizers, every element is calibrated to maximize functionality and visual elegance. Whether you desire a minimalist European aesthetic or warm transitional styling, we deliver a kitchen that elevates your everyday rituals.",
    includedItems: [
      {
        title: "Custom Cabinetry & Island Fabrication",
        description:
          "Solid wood frame cabinets with Blum soft-close hardware, integrated spice pull-outs, and custom pantry units.",
      },
      {
        title: "Luxury Countertop Sourcing & Installation",
        description:
          "Precision-mitered waterfall edge quartz, quartzite, or marble slabs cut and polished to perfection.",
      },
      {
        title: "Designer Backsplash & Ambient Task Lighting",
        description:
          "Handmade ceramic or zellige tile installation accompanied by discreet under-cabinet LED temperature lighting.",
      },
      {
        title: "Appliance Fitting & Plumbing Relocation",
        description:
          "Seamless built-in fitting for pro-style ranges, panel-ready refrigeration, undermount sinks, and pot fillers.",
      },
      {
        title: "Fine Surface Finishing & Site Cleanliness",
        description:
          "Final sealants, micro-grouting, hardware alignment, and HEPA-filtered clean before handoff.",
      },
    ],
    seo: {
      metaTitle: "Bespoke Chef's Kitchen Remodel | Dwellora",
      metaDescription:
        "Custom kitchen renovations with tailored cabinetry, quartz countertops, and smart spatial flow by Dwellora.",
      keywords:
        "kitchen renovation, custom kitchen cabinets, quartz countertops, kitchen remodeling contractor, luxury kitchen",
      ogTitle: "Bespoke Chef's Kitchen Remodel | Dwellora",
      ogDescription:
        "Transform your culinary space with custom cabinetry and luxury countertop craftsmanship.",
      ogImage: "https://i.ibb.co.com/QFkbVB1m/kitchen-renovation.jpg",
      canonicalUrl: "https://dwellora.com/services/bespoke-chefs-kitchen-remodel",
    },
  },
  {
    title: "Spa-Inspired Primary Bathroom Renovation",
    slug: "spa-inspired-primary-bathroom-renovation",
    categorySlugHint: "bathroom-renovation",
    categoryId: CATEGORY_IDS["bathroom-renovation"],
    image: "https://i.ibb.co.com/hR3tXvQ/bathroom-renovation.jpg",
    shortDescription:
      "Turn your primary ensuite into a private wellness retreat featuring curbless walk-in showers, freestanding soaker tubs, and radiant heated floors.",
    description:
      "Indulge in peaceful tranquility with a bespoke bathroom remodel designed to rejuvenate mind and body. We balance tactile natural stones, soothing color palettes, and hotel-inspired amenities to craft your personal sanctuary.\n\nOur skilled team installs state-of-the-art waterproofing systems, frameless glass enclosures, floating double vanities with stone basins, and concealed linear drains. Every detail is engineered for durability, moisture protection, and serene sensory appeal.",
    includedItems: [
      {
        title: "Schluter Waterproofing & Subfloor Preparation",
        description:
          "Complete membrane waterproofing system ensuring leak-proof longevity behind walls and beneath shower pans.",
      },
      {
        title: "Curbless Walk-in Rain Shower",
        description:
          "Seamless low-profile entry with concealed linear drains, thermostatic multi-head valves, and 10mm glass screens.",
      },
      {
        title: "Freestanding Soaking Tub & Floor-Mounted Filler",
        description:
          "Sculptural resin or acrylic tub positioning paired with architectural matte black or brushed brass tapware.",
      },
      {
        title: "Custom Floating Vanity & Backlit Mirrors",
        description:
          "Dovetail drawer vanity with dual undermount basins, stone tops, and defogging LED ambient mirrors.",
      },
      {
        title: "Underfloor Radiant Heating System",
        description:
          "Programmable smart thermostat controlling warm floor cables beneath porcelain or natural stone tiles.",
      },
    ],
    seo: {
      metaTitle: "Spa-Inspired Primary Bathroom Renovation | Dwellora",
      metaDescription:
        "Transform your bathroom into a luxury spa retreat with curbless showers, custom vanities, and radiant heat.",
      keywords:
        "bathroom remodel, spa bathroom, curbless shower, luxury ensuite renovation, bathroom contractor",
      ogTitle: "Spa-Inspired Primary Bathroom Renovation | Dwellora",
      ogDescription:
        "Create your personal wellness oasis with custom tilework, soaking tubs, and modern fixtures.",
      ogImage: "https://i.ibb.co.com/hR3tXvQ/bathroom-renovation.jpg",
      canonicalUrl: "https://dwellora.com/services/spa-inspired-primary-bathroom-renovation",
    },
  },
  {
    title: "Architectural Living Room Millwork & Media Walls",
    slug: "architectural-living-room-millwork-media-walls",
    categorySlugHint: "living-room-carpentry",
    categoryId: CATEGORY_IDS["living-room-carpentry"],
    image: "https://i.ibb.co.com/YcBv8K4/living-room-carpentry.jpg",
    shortDescription:
      "Custom built-in library bookcases, integrated acoustic media walls, and fireplace surrounds that anchor your main gathering space.",
    description:
      "Elevate your living room into an architectural centerpiece with bespoke carpentry and media integration. We engineer made-to-measure built-in shelving, hidden wire concealment chases, fluted wood feature panels, and contemporary fireplace surrounds.\n\nEach joinery unit is crafted in premium hardwoods and finished with furniture-grade lacquers or natural hardwax oils, providing your home with statement storage that balances artful presentation and practical utility.",
    includedItems: [
      {
        title: "Bespoke Built-In Bookcases & Credenzas",
        description:
          "Precision floor-to-ceiling shelving with integrated LED channel lighting and touch-latch lower cabinetry.",
      },
      {
        title: "Acoustic Wall Paneling & Media Integration",
        description:
          "Fluted oak or walnut slat paneling with sound-dampening acoustic felt backing and conduit wire routing.",
      },
      {
        title: "Fireplace Mantels & Porcelain Slab Surrounds",
        description:
          "Custom hearth design featuring large-format sintered stone slabs, linear electric or gas inserts, and floating mantels.",
      },
      {
        title: "Architectural Crown Molding & Baseboards",
        description:
          "High-profile baseboards, trim casing, and coffered or shadow-line ceiling details.",
      },
    ],
    seo: {
      metaTitle: "Architectural Living Room Millwork & Media Walls | Dwellora",
      metaDescription:
        "Handcrafted living room joinery, custom built-ins, media walls, and fireplace surrounds by Dwellora.",
      keywords:
        "custom millwork, media wall, built-in shelving, living room carpentry, fireplace surround",
      ogTitle: "Architectural Living Room Millwork & Media Walls | Dwellora",
      ogDescription:
        "Custom built-in cabinetry, fluted wood paneling, and media walls crafted for refined living spaces.",
      ogImage: "https://i.ibb.co.com/YcBv8K4/living-room-carpentry.jpg",
      canonicalUrl: "https://dwellora.com/services/architectural-living-room-millwork-media-walls",
    },
  },
  {
    title: "Hardwood & Luxury Tile Flooring Installation",
    slug: "hardwood-luxury-tile-flooring-installation",
    categorySlugHint: "flooring-tile-installation",
    categoryId: CATEGORY_IDS["flooring-tile-installation"],
    image: "https://i.ibb.co.com/dK0mG1v/flooring-installation.jpg",
    shortDescription:
      "Precision floor leveling, wide-plank European oak installation, and large-format porcelain tile artistry.",
    description:
      "A flawless floor is the foundation of exceptional interior design. Our master flooring artisans specialize in wide-plank engineered European white oak, herringbone patterns, and precision-laid large-format porcelain tiles.\n\nWe prioritize subfloor moisture barriers, laser-guided acoustic underlayment, and expansion joints to ensure your floors remain perfectly silent, level, and breathtaking for decades to come.",
    includedItems: [
      {
        title: "Subfloor Remediation & Self-Leveling",
        description:
          "Grinding, moisture testing, and polymer-modified self-leveling compounds for completely flat foundations.",
      },
      {
        title: "Wide-Plank Engineered & Solid Hardwood",
        description:
          "Full glue-down or nail-assist installation of prime European oak with micro-beveled edges.",
      },
      {
        title: "Herringbone & Chevron Parquet Patterns",
        description:
          "Artisan pattern alignment with custom-cut feature borders and flush wood vent integrations.",
      },
      {
        title: "Large-Format Porcelain & Natural Stone Tiling",
        description:
          "Precision-spaced rectified tiles with epoxy grouting for stain resistance and crisp aesthetic lines.",
      },
      {
        title: "Flush Thresholds & Base Shoe Finishing",
        description:
          "Smooth seamless transitions between materials without clumsy transition strips.",
      },
    ],
    seo: {
      metaTitle: "Hardwood & Luxury Tile Flooring Installation | Dwellora",
      metaDescription:
        "Expert flooring installation: European oak, herringbone parquet, and porcelain tile by Dwellora.",
      keywords:
        "hardwood flooring, herringbone parquet, porcelain tile installation, floor leveling, luxury flooring",
      ogTitle: "Hardwood & Luxury Tile Flooring Installation | Dwellora",
      ogDescription:
        "Premium wide-plank hardwood and large-format porcelain tile installation with master craftsmanship.",
      ogImage: "https://i.ibb.co.com/dK0mG1v/flooring-installation.jpg",
      canonicalUrl: "https://dwellora.com/services/hardwood-luxury-tile-flooring-installation",
    },
  },
  {
    title: "Fine Interior Painting & Lime Wash Wall Finishes",
    slug: "fine-interior-painting-lime-wash-wall-finishes",
    categorySlugHint: "painting-wall-finishing",
    categoryId: CATEGORY_IDS["painting-wall-finishing"],
    image: "https://i.ibb.co.com/qMhP6Tx/painting-finishing.jpg",
    shortDescription:
      "Flawless Level 5 drywall finishing, artisanal Roman clay, lime wash textures, and premium designer paint palettes.",
    description:
      "Color and texture define the soul of an interior. Our fine finishing division delivers flawless Level 5 drywall surfaces, subtle mineral lime washes, and velvety micro-cement accent walls that catch the light with organic richness.\n\nWe strictly utilize low-VOC, premium architectural paints from Benjamin Moore and Farrow & Ball, protected by meticulous masking, dustless sanding, and multiple coat applications for silky, washable perfection.",
    includedItems: [
      {
        title: "Comprehensive Surface Prep & Dustless Sanding",
        description:
          "Skim coating, hairline crack repairs, and HEPA vacuum sanding to achieve silky smooth Level 5 readiness.",
      },
      {
        title: "Artisanal Mineral & Lime Wash Application",
        description:
          "Hand-troweled Roman clay, Venetian plaster, or textured mineral washes for tactile organic depth.",
      },
      {
        title: "Designer Multi-Coat Architectural Paint",
        description:
          "Even coverage with Farrow & Ball or Benjamin Moore premium paints on walls, ceilings, and millwork.",
      },
      {
        title: "Spray-Finished Cabinetry & Wood Trim",
        description:
          "Factory-finish HVLP spray application on doors, casings, and baseboards for brushmark-free luster.",
      },
      {
        title: "Floor & Furniture Masking Protection",
        description:
          "Full heavy-duty poly masking and rosin paper containment to ensure your home remains spotless.",
      },
    ],
    seo: {
      metaTitle: "Fine Interior Painting & Lime Wash Wall Finishes | Dwellora",
      metaDescription:
        "Interior painting, Roman clay, Venetian plaster, and fine trim spray finishing by Dwellora specialists.",
      keywords:
        "interior painting, lime wash paint, Venetian plaster, Level 5 drywall, luxury house painting",
      ogTitle: "Fine Interior Painting & Lime Wash Wall Finishes | Dwellora",
      ogDescription:
        "Transform your walls with artisanal lime washes, flawless spray trim, and designer paint palettes.",
      ogImage: "https://i.ibb.co.com/qMhP6Tx/painting-finishing.jpg",
      canonicalUrl: "https://dwellora.com/services/fine-interior-painting-lime-wash-wall-finishes",
    },
  },
];

/**
 * Main Seed Runner
 */
async function seedServices() {
  console.log("==========================================");
  console.log("   DWELLORA: Services MongoDB Seeder      ");
  console.log("==========================================\n");

  try {
    console.log("Connecting to MongoDB...");
    await connectDatabase();
    const db = getDatabase();
    const servicesColl = db.collection<Service>("services");
    console.log('Connected to database collection: "services"\n');

    // Attempt to fetch existing categories from the DB to dynamically resolve categoryId if possible
    const categoriesColl = categoryCollection();
    const existingCategories = await categoriesColl.find({}).toArray();
    const categoryBySlug = new Map<string, ObjectId>();

    for (const cat of existingCategories) {
      if (cat.slug && cat._id) {
        categoryBySlug.set(cat.slug.toLowerCase(), cat._id);
      }
    }

    if (existingCategories.length > 0) {
      console.log(
        `Found ${existingCategories.length} existing categories in database for auto-matching.`
      );
    } else {
      console.log(
        "No existing categories found in DB. Falling back to configured category ObjectIds."
      );
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of SEED_SERVICES) {
      // 1. Prevent duplicate insertion using slug
      const existing = await servicesColl.findOne({ slug: item.slug });
      if (existing) {
        console.log(`[SKIPPED] Service slug "${item.slug}" already exists.`);
        skippedCount++;
        continue;
      }

      // 2. Resolve categoryId as ObjectId
      let targetCategoryId: ObjectId;
      if (
        item.categorySlugHint &&
        categoryBySlug.has(item.categorySlugHint.toLowerCase())
      ) {
        targetCategoryId = categoryBySlug.get(
          item.categorySlugHint.toLowerCase()
        )!;
      } else if (item.categoryId) {
        targetCategoryId =
          item.categoryId instanceof ObjectId
            ? item.categoryId
            : new ObjectId(String(item.categoryId));
      } else {
        // Fallback default ObjectId if none provided
        targetCategoryId = new ObjectId();
      }

      // 3. Convert ImgBB URLs (https://i.ibb.co.com/ -> https://i.ibb.co/)
      const sanitizedImage = sanitizeImgBbUrl(item.image);
      const sanitizedOgImage = sanitizeImgBbUrl(item.seo.ogImage || item.image);

      const now = new Date();

      // 4. Construct complete Service document
      const serviceDoc: Service = {
        title: item.title.trim(),
        slug: item.slug.trim(),
        shortDescription: item.shortDescription.trim(),
        description: item.description.trim(),
        image: sanitizedImage,
        includedItems: item.includedItems.map((inc) => ({
          title: inc.title.trim(),
          description: inc.description.trim(),
        })),
        seo: {
          metaTitle: item.seo.metaTitle.trim(),
          metaDescription: item.seo.metaDescription.trim(),
          keywords: item.seo.keywords.trim(),
          ogTitle: item.seo.ogTitle.trim(),
          ogDescription: item.seo.ogDescription.trim(),
          ogImage: sanitizedOgImage,
          canonicalUrl: item.seo.canonicalUrl.trim(),
        },
        categoryId: targetCategoryId,
        status: "published",
        createdAt: now,
        updatedAt: now,
      };

      await servicesColl.insertOne(serviceDoc);
      console.log(`[INSERTED] "${serviceDoc.title}" (slug: ${serviceDoc.slug})`);
      insertedCount++;
    }

    console.log("\n==========================================");
    console.log(`Results: ${insertedCount} inserted, ${skippedCount} skipped.`);
    console.log("Services seed completed successfully! 🎉");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error while seeding services:", error);
    process.exit(1);
  }
}

// Execute seed function if run directly
seedServices();
