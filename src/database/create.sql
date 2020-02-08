create schema generator;
create table generator.item (
  id serial,
  type text not null,
  description text not null
);
insert into generator.item (type, description)
values
  ('prefix', 'Air');
insert into generator.item (type, description)
values
  ('prefix', 'Red');
insert into generator.item (type, description)
values
  ('prefix', 'Mind');
insert into generator.item (type, description)
values
  ('suffix', 'Hub');
insert into generator.item (type, description)
values
  ('suffix', 'Station');
insert into generator.item (type, description)
values
  ('suffix', 'Go');
