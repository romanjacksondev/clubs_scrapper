-- AlterTable
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Product'
          AND column_name = 'imageUrl'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;
    END IF;
END $$;