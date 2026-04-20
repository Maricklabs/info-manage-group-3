-- Trigger to update food stock when an order item is created
-- This automatically decreases stock_qty in the Foods table

CREATE TRIGGER update_food_stock_on_order
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Foods 
    SET stock_qty = stock_qty - NEW.order_quantity
    WHERE food_id = NEW.food_id;
END;

-- Optional: Trigger to restore stock if an order item is deleted (for cancellations)
CREATE TRIGGER restore_food_stock_on_delete
AFTER DELETE ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Foods 
    SET stock_qty = stock_qty + OLD.order_quantity
    WHERE food_id = OLD.food_id;
END;

-- Optional: Trigger to handle stock updates if quantity is modified
CREATE TRIGGER update_food_stock_on_update
AFTER UPDATE ON OrderItems
FOR EACH ROW
BEGIN
    DECLARE quantity_difference INT;
    SET quantity_difference = NEW.order_quantity - OLD.order_quantity;
    
    UPDATE Foods 
    SET stock_qty = stock_qty - quantity_difference
    WHERE food_id = NEW.food_id;
END;


//Invoice trigger

DELIMITER $$

CREATE TRIGGER create_invoice_after_order
AFTER INSERT ON Order_Record
FOR EACH ROW
BEGIN
    INSERT INTO Invoice (order_id, total_amount, status)
    VALUES (NEW.order_id, NEW.total_amount, 'Unpaid');
END$$

DELIMITER ;