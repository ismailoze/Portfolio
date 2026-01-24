using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDeprecatedColumnsFromProjectsAndBlogPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Projects tablosundan gereksiz kolonları kaldır (varsa)
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name = 'Projects' 
                        AND column_name = 'Description'
                    ) THEN
                        ALTER TABLE ""Projects"" DROP COLUMN ""Description"";
                    END IF;
                    
                    IF EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name = 'Projects' 
                        AND column_name = 'Technologies'
                    ) THEN
                        ALTER TABLE ""Projects"" DROP COLUMN ""Technologies"";
                    END IF;
                    
                    IF EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name = 'Projects' 
                        AND column_name = 'Title'
                    ) THEN
                        ALTER TABLE ""Projects"" DROP COLUMN ""Title"";
                    END IF;
                END $$;
            ");

            // BlogPosts tablosundan gereksiz kolonları kaldır (varsa)
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name = 'BlogPosts' 
                        AND column_name = 'Content'
                    ) THEN
                        ALTER TABLE ""BlogPosts"" DROP COLUMN ""Content"";
                    END IF;
                    
                    IF EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name = 'BlogPosts' 
                        AND column_name = 'Excerpt'
                    ) THEN
                        ALTER TABLE ""BlogPosts"" DROP COLUMN ""Excerpt"";
                    END IF;
                    
                    IF EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name = 'BlogPosts' 
                        AND column_name = 'Slug'
                    ) THEN
                        ALTER TABLE ""BlogPosts"" DROP COLUMN ""Slug"";
                    END IF;
                    
                    IF EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name = 'BlogPosts' 
                        AND column_name = 'Title'
                    ) THEN
                        ALTER TABLE ""BlogPosts"" DROP COLUMN ""Title"";
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Technologies",
                table: "Projects",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Excerpt",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "BlogPosts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
