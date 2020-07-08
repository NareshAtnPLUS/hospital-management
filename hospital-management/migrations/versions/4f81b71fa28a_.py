"""empty message

Revision ID: 4f81b71fa28a
Revises: 16dffdf8c610
Create Date: 2020-03-22 13:11:24.882755

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4f81b71fa28a'
down_revision = '16dffdf8c610'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('doctors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=20), nullable=False),
    sa.Column('last_name', sa.String(length=20), nullable=False),
    sa.Column('door_no', sa.String(length=3), nullable=False),
    sa.Column('street', sa.String(length=70), nullable=False),
    sa.Column('district', sa.String(length=20), nullable=False),
    sa.Column('state', sa.String(length=20), nullable=False),
    sa.Column('username', sa.String(length=20), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=60), nullable=False),
    sa.Column('specialist', sa.String(length=15), nullable=False),
    sa.Column('qualifications', sa.String(length=20), nullable=False),
    sa.Column('surgeries', sa.String(length=20), nullable=False),
    sa.Column('age', sa.String(length=5), nullable=False),
    sa.Column('dob', sa.String(length=20), nullable=False),
    sa.Column('Account_type', sa.String(length=20), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('doctors')
    # ### end Alembic commands ###