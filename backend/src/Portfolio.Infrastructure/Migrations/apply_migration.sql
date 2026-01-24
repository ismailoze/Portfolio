-- Migration: RemoveDeprecatedColumnsFromProjectsAndBlogPosts
-- Bu script sadece kolonları kaldırır ve migration history'ye ekler

-- Projects tablosundan gereksiz kolonları kaldır (varsa)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Projects' 
        AND column_name = 'Description'
    ) THEN
        ALTER TABLE "Projects" DROP COLUMN "Description";
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Projects' 
        AND column_name = 'Technologies'
    ) THEN
        ALTER TABLE "Projects" DROP COLUMN "Technologies";
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Projects' 
        AND column_name = 'Title'
    ) THEN
        ALTER TABLE "Projects" DROP COLUMN "Title";
    END IF;
END $$;

-- BlogPosts tablosundan gereksiz kolonları kaldır (varsa)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'BlogPosts' 
        AND column_name = 'Content'
    ) THEN
        ALTER TABLE "BlogPosts" DROP COLUMN "Content";
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'BlogPosts' 
        AND column_name = 'Excerpt'
    ) THEN
        ALTER TABLE "BlogPosts" DROP COLUMN "Excerpt";
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'BlogPosts' 
        AND column_name = 'Slug'
    ) THEN
        ALTER TABLE "BlogPosts" DROP COLUMN "Slug";
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'BlogPosts' 
        AND column_name = 'Title'
    ) THEN
        ALTER TABLE "BlogPosts" DROP COLUMN "Title";
    END IF;
END $$;

-- Migration history'ye ekle (eğer yoksa)
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
SELECT '20260117204450_RemoveDeprecatedColumnsFromProjectsAndBlogPosts', '9.0.0'
WHERE NOT EXISTS (
    SELECT 1 
    FROM "__EFMigrationsHistory" 
    WHERE "MigrationId" = '20260117204450_RemoveDeprecatedColumnsFromProjectsAndBlogPosts'
);
