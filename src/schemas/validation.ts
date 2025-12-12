import { z } from "zod";

/**
 * Schema de validación para competidores de Kata
 */
export const kataCompetitorSchema = z.object({
  Nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  Edad: z
    .number()
    .int("La edad debe ser un número entero")
    .min(5, "La edad mínima es 5 años")
    .max(100, "La edad máxima es 100 años"),
  Categoria: z.string().min(1, "La categoría es requerida").trim(),
});

/**
 * Schema de validación para competidores de Kumite
 */
export const kumiteCompetitorSchema = z.object({
  Nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  Edad: z
    .number()
    .int("La edad debe ser un número entero")
    .min(5, "La edad mínima es 5 años")
    .max(100, "La edad máxima es 100 años"),
});

/**
 * Schema de validación para puntajes de jueces
 */
export const judgeScoreSchema = z.object({
  score: z
    .string()
    .regex(/^\d\.\d$/, "El formato debe ser X.X")
    .refine(
      (val) => {
        const num = parseFloat(val);

        return num >= 5.0 && num <= 9.0;
      },
      { message: "El puntaje debe estar entre 5.0 y 9.0" },
    ),
});

/**
 * Schema de validación para configuración de Kata
 */
export const kataConfigSchema = z.object({
  numJudges: z
    .number()
    .int()
    .refine((val) => val === 3 || val === 5, {
      message: "El número de jueces debe ser 3 o 5",
    }),
  base: z
    .number()
    .int()
    .refine((val) => val === 6 || val === 7 || val === 8, {
      message: "La puntuación media debe ser 6, 7 u 8",
    }),
  categoria: z.string().min(1, "La categoría es requerida"),
  area: z.string().min(1, "El área es requerida"),
});

/**
 * Schema de validación para configuración de Kumite
 */
export const kumiteConfigSchema = z.object({
  categoria: z.string().min(1, "La categoría es requerida"),
  area: z.string().min(1, "El área es requerida"),
  tiempoInicial: z
    .number()
    .int()
    .min(30, "El tiempo mínimo es 30 segundos")
    .max(600, "El tiempo máximo es 10 minutos"),
});

/**
 * Schema de validación para carga de Excel
 */
export const excelUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => {
        const validExtensions = [".xlsx", ".xls"];

        return validExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext),
        );
      },
      { message: "El archivo debe ser un Excel (.xlsx o .xls)" },
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      { message: "El archivo no debe exceder 5MB" },
    ),
});

// Tipos TypeScript inferidos de los schemas
export type KataCompetitor = z.infer<typeof kataCompetitorSchema>;
export type KumiteCompetitor = z.infer<typeof kumiteCompetitorSchema>;
export type JudgeScore = z.infer<typeof judgeScoreSchema>;
export type KataConfig = z.infer<typeof kataConfigSchema>;
export type KumiteConfig = z.infer<typeof kumiteConfigSchema>;
export type ExcelUpload = z.infer<typeof excelUploadSchema>;
