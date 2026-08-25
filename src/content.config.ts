import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Schema nội dung cho phân khúc "trung tâm ngoại ngữ" (EduLayout).
 *
 * Nguyên tắc: mọi thứ đổi theo từng khách đều nằm ở đây và trong file JSON.
 * Component chỉ nhận props, không hardcode nội dung.
 * Khi bàn giao gói bảo trì, khách/DG chỉ sửa JSON — không đụng code.
 *
 * Nhiều trường để optional một cách có chủ đích: khách chưa công bố thời lượng,
 * sĩ số hay học phí của mọi khóa. Thiếu thì component ẩn dòng đó đi,
 * KHÔNG bịa số cho đủ chỗ.
 */

const cta = z.object({
  label: z.string(),
  href: z.string(),
});

const clients = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/clients' }),
  schema: ({ image }) =>
    z.object({
      // --- Nhận diện & SEO ---
      name: z.string(),
      shortName: z.string(),
      tagline: z.string(),
      logo: image(),
      logoLight: image(),
      seo: z.object({
        title: z.string().max(70),
        description: z.string().max(180),
        locale: z.string().default('vi_VN'),
      }),

      // --- Liên hệ ---
      contact: z.object({
        // Nhiều số: mỗi số gắn với một người phụ trách.
        phones: z
          .array(z.object({ name: z.string(), number: z.string(), display: z.string() }))
          .min(1),
        zaloUrl: z.string().url(),
        facebookUrl: z.string().url().optional(),
        instagramUrl: z.string().url().optional(),
        email: z.string().email(),
        // Nhiều cơ sở: mỗi cơ sở có bản đồ riêng.
        locations: z
          .array(
            z.object({
              label: z.string(),
              address: z.string(),
              mapEmbedUrl: z.string().optional(),
              mapDirectionsUrl: z.string().optional(),
            }),
          )
          .min(1),
        openingHours: z.string(),
      }),

      // --- Các section ---
      hero: z.object({
        eyebrow: z.string(),
        heading: z.string(),
        subheading: z.string(),
        primaryCta: cta,
        secondaryCta: cta,
        image: image(),
        imageAlt: z.string(),
        // Cam kết dạng gạch đầu dòng — dùng thay cho số liệu, vì khách
        // chưa công bố số học viên / tỉ lệ đầu ra nào có thể kiểm chứng.
        commitments: z.array(z.string()).min(2).max(6),
      }),

      courses: z.object({
        heading: z.string(),
        intro: z.string(),
        items: z
          .array(
            z.object({
              slug: z.string(),
              name: z.string(),
              summary: z.string(),
              audience: z.string().optional(),
              duration: z.string().optional(),
              classSize: z.string().optional(),
              tuition: z.string().optional(),
              featured: z.boolean().default(false),
            }),
          )
          .min(1),
      }),

      whyUs: z.object({
        heading: z.string(),
        items: z
          .array(
            z.object({
              // Chỉ nhận icon đã có sẵn trong ui/Icon.astro — sai tên là build fail ngay,
              // không phải chờ tới lúc xem trang mới phát hiện.
              icon: z.enum(['users', 'route', 'chart', 'badge', 'calendar', 'shield']),
              title: z.string(),
              body: z.string(),
            }),
          )
          .min(3)
          .max(6),
      }),

      activities: z.object({
        heading: z.string(),
        intro: z.string(),
        items: z
          .array(
            z.object({
              title: z.string(),
              caption: z.string(),
              image: image(),
              imageAlt: z.string(),
            }),
          )
          .min(1),
      }),

      testimonials: z.object({
        heading: z.string(),
        intro: z.string().optional(),
        items: z.array(
          z.object({
            quote: z.string(),
            author: z.string(),
            role: z.string(),
            image: image().optional(),
            imageAlt: z.string().optional(),
          }),
        ),
      }),

      contactSection: z.object({
        heading: z.string(),
        intro: z.string(),
      }),
    }),
});

export const collections = { clients };
