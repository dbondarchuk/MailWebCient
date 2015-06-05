namespace GmailWebClient.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedContacts : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Contact",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        Address = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Contact");
        }
    }
}
